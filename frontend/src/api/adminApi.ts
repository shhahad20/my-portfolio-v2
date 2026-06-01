import axios from 'axios';
import { API_URL } from './api';
import type { ApiBlogPost, ApiContentBlock } from './blogApi';

// ── Token helpers ──────────────────────────────────────────────────────────────

const TOKEN_KEY = 'blog_admin_token';

export const authStore = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

function authHeaders() {
  const token = authStore.get();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Types ──────────────────────────────────────────────────────────────────────

export type BlockType =
  | 'paragraph'
  | 'heading'
  | 'code'
  | 'quote'
  | 'image'
  | 'video'
  | 'link'
  | 'list'
  | 'divider'
  | 'callout';

export interface ContentBlockInput {
  type: BlockType;
  data: Record<string, unknown>;
}

export interface PostInput {
  title: string;
  excerpt?: string;
  cover_image_url?: string | null;
  category?: string;
  tags?: string[];
  featured?: boolean;
  blocks?: ContentBlockInput[];
}

export interface PostForEdit extends ApiBlogPost {
  blocks: ApiContentBlock[];
}

// ── API client ─────────────────────────────────────────────────────────────────

export const adminApi = {
  login: (password: string) =>
    axios
      .post<{ token: string; expiresIn: number }>(`${API_URL}/admin/login`, { password })
      .then(r => r.data),

  getPosts: () =>
    axios
      .get<ApiBlogPost[]>(`${API_URL}/admin/posts`, { headers: authHeaders() })
      .then(r => r.data),

  getPost: (id: string) =>
    axios
      .get<PostForEdit>(`${API_URL}/admin/posts/${id}`, { headers: authHeaders() })
      .then(r => r.data),

  createPost: (body: PostInput) =>
    axios
      .post<ApiBlogPost>(`${API_URL}/admin/posts`, body, { headers: authHeaders() })
      .then(r => r.data),

  updatePost: (id: string, body: Partial<PostInput> & { status?: string }) =>
    axios
      .put<ApiBlogPost>(`${API_URL}/admin/posts/${id}`, body, { headers: authHeaders() })
      .then(r => r.data),

  deletePost: (id: string) =>
    axios.delete(`${API_URL}/admin/posts/${id}`, { headers: authHeaders() }),

  publishPost: (id: string) =>
    axios
      .post<ApiBlogPost>(`${API_URL}/admin/posts/${id}/publish`, {}, { headers: authHeaders() })
      .then(r => r.data),

  unpublishPost: (id: string) =>
    axios
      .post<ApiBlogPost>(`${API_URL}/admin/posts/${id}/unpublish`, {}, { headers: authHeaders() })
      .then(r => r.data),

  uploadMedia: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return axios
      .post<{ url: string; path: string }>(`${API_URL}/admin/media/upload`, form, {
        headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },

  deleteMedia: (path: string) =>
    axios.delete(`${API_URL}/admin/media`, { data: { path }, headers: authHeaders() }),
};
