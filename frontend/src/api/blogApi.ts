import axios from 'axios';
import { API_URL } from './api';

export interface ApiBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string | null;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
  read_time: number;
  featured: boolean;
}

export interface ApiContentBlock {
  id: string;
  post_id: string;
  type: 'paragraph' | 'heading' | 'code' | 'quote' | 'image' | 'video' | 'link' | 'list' | 'divider' | 'callout';
  sort_order: number;
  data: Record<string, unknown>;
}

export interface ApiPostDetail extends ApiBlogPost {
  blocks: ApiContentBlock[];
  related: Omit<ApiBlogPost, 'status' | 'created_at'>[];
}

export const blogApi = {
  getPosts: (params?: { category?: string; limit?: number }) =>
    axios.get<ApiBlogPost[]>(`${API_URL}/blog/posts`, { params }).then(r => r.data),

  getPost: (slug: string) =>
    axios.get<ApiPostDetail>(`${API_URL}/blog/posts/${slug}`).then(r => r.data),
};
