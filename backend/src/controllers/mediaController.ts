import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabaseAdminClient.js';
import ApiError from '../errors/ApiError.js';

const BUCKET = 'blog-media';

export const uploadMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      next(ApiError.badRequest('No file provided'));
      return;
    }

    const ext = file.originalname.split('.').pop()?.toLowerCase() ?? 'bin';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const path = `uploads/${filename}`;

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, file.buffer, { contentType: file.mimetype, upsert: false });

    if (error) throw ApiError.internal(`Upload failed: ${error.message}`);

    const { data: { publicUrl } } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(data.path);

    res.json({ url: publicUrl, path: data.path });
  } catch (err) {
    next(err);
  }
};

export const deleteMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { path } = req.body as { path?: string };
    if (!path) {
      next(ApiError.badRequest('path is required'));
      return;
    }

    const { error } = await supabaseAdmin.storage.from(BUCKET).remove([path]);
    if (error) throw ApiError.internal('Failed to delete file');
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
