import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient.js';
import { supabaseAdmin } from '../config/supabaseAdminClient.js';
import ApiError from '../errors/ApiError.js';

interface ContentBlock {
  type: 'paragraph' | 'heading' | 'code' | 'quote' | 'image' | 'video' | 'link' | 'list' | 'divider' | 'callout';
  data: Record<string, unknown>;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');
}

function estimateReadTime(blocks: ContentBlock[]): number {
  const words = blocks
    .filter(b => ['paragraph', 'heading', 'quote', 'callout', 'list'].includes(b.type))
    .map(b => {
      if (b.type === 'list') return ((b.data?.items as string[]) || []).join(' ');
      return (b.data?.text as string) || '';
    })
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ── Public ─────────────────────────────────────────────────────────────────────

export const getPublishedPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, limit } = req.query;

    let query = supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, category, tags, published_at, read_time, featured, cover_image_url')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (category && typeof category === 'string') query = query.eq('category', category);
    if (limit) query = query.limit(Number(limit));

    const { data, error } = await query;
    if (error) throw ApiError.internal('Failed to fetch posts');
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getPostBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;

    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (postError || !post) throw ApiError.notFound(`Post "${slug}" not found`);

    const [blocksResult, relatedResult] = await Promise.all([
      supabase
        .from('blog_content_blocks')
        .select('*')
        .eq('post_id', post.id)
        .order('sort_order', { ascending: true }),
      supabase
        .from('blog_posts')
        .select('id, slug, title, excerpt, category, cover_image_url, published_at, read_time')
        .eq('status', 'published')
        .eq('category', post.category)
        .neq('id', post.id)
        .limit(3),
    ]);

    if (blocksResult.error) throw ApiError.internal('Failed to fetch post content');

    res.json({
      ...post,
      blocks: blocksResult.data || [],
      related: relatedResult.data || [],
    });
  } catch (err) {
    next(err);
  }
};

// ── Admin ──────────────────────────────────────────────────────────────────────

export const getAllPosts = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select('id, slug, title, excerpt, category, tags, status, published_at, created_at, read_time, featured, cover_image_url')
      .order('created_at', { ascending: false });

    if (error) throw ApiError.internal('Failed to fetch posts');
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getPostForEdit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const [postResult, blocksResult] = await Promise.all([
      supabaseAdmin.from('blog_posts').select('*').eq('id', id).single(),
      supabaseAdmin
        .from('blog_content_blocks')
        .select('*')
        .eq('post_id', id)
        .order('sort_order', { ascending: true }),
    ]);

    if (postResult.error || !postResult.data) throw ApiError.notFound('Post not found');
    if (blocksResult.error) throw ApiError.internal('Failed to fetch blocks');

    res.json({ ...postResult.data, blocks: blocksResult.data || [] });
  } catch (err) {
    next(err);
  }
};

export const createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, excerpt, cover_image_url, category, tags, featured, blocks } = req.body as {
      title?: string;
      excerpt?: string;
      cover_image_url?: string;
      category?: string;
      tags?: string[];
      featured?: boolean;
      blocks?: ContentBlock[];
    };

    if (!title?.trim()) {
      next(ApiError.badRequest('Title is required'));
      return;
    }

    const slug = slugify(title);

    const { data: existing } = await supabaseAdmin
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (existing) {
      next(ApiError.exist(`A post with slug "${slug}" already exists`));
      return;
    }

    const { data: post, error: postError } = await supabaseAdmin
      .from('blog_posts')
      .insert({
        title: title.trim(),
        slug,
        excerpt: excerpt || '',
        cover_image_url: cover_image_url || null,
        category: category || 'Uncategorized',
        tags: tags || [],
        featured: featured || false,
        status: 'draft',
        read_time: estimateReadTime(blocks || []),
      })
      .select()
      .single();

    if (postError) throw ApiError.internal('Failed to create post');

    if (blocks?.length) {
      const rows = blocks.map((b, i) => ({
        post_id: post.id,
        type: b.type,
        sort_order: i,
        data: b.data,
      }));
      const { error: blocksError } = await supabaseAdmin.from('blog_content_blocks').insert(rows);
      if (blocksError) throw ApiError.internal('Failed to save content blocks');
    }

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, excerpt, cover_image_url, category, tags, featured, status, blocks } = req.body as {
      title?: string;
      excerpt?: string;
      cover_image_url?: string;
      category?: string;
      tags?: string[];
      featured?: boolean;
      status?: string;
      blocks?: ContentBlock[];
    };

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (title !== undefined) {
      updates.title = title.trim();
      updates.slug = slugify(title);
    }
    if (excerpt !== undefined) updates.excerpt = excerpt;
    if (cover_image_url !== undefined) updates.cover_image_url = cover_image_url;
    if (category !== undefined) updates.category = category;
    if (tags !== undefined) updates.tags = tags;
    if (featured !== undefined) updates.featured = featured;
    if (status !== undefined) updates.status = status;
    if (blocks !== undefined) updates.read_time = estimateReadTime(blocks);

    const { data: post, error } = await supabaseAdmin
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw ApiError.internal('Failed to update post');

    if (blocks !== undefined) {
      await supabaseAdmin.from('blog_content_blocks').delete().eq('post_id', id);
      if (blocks.length) {
        const rows = blocks.map((b, i) => ({
          post_id: id,
          type: b.type,
          sort_order: i,
          data: b.data,
        }));
        const { error: blocksError } = await supabaseAdmin.from('blog_content_blocks').insert(rows);
        if (blocksError) throw ApiError.internal('Failed to update content blocks');
      }
    }

    res.json(post);
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin.from('blog_posts').delete().eq('id', id);
    if (error) throw ApiError.internal('Failed to delete post');
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const publishPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw ApiError.internal('Failed to publish post');
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const unpublishPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .update({ status: 'draft', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw ApiError.internal('Failed to unpublish post');
    res.json(data);
  } catch (err) {
    next(err);
  }
};
