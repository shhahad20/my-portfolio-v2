import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { adminApi, authStore, type PostInput, type ContentBlockInput, type BlockType } from "../../api/adminApi";
import type { ApiBlogPost } from "../../api/blogApi";
import "./style/blogAdmin.scss";

// ── Types ──────────────────────────────────────────────────────────────────────

interface EditorBlock extends ContentBlockInput {
  _id: string; // local-only key for React reconciliation
}

type AdminView = "list" | "editor";

const BLOCK_TYPES: { type: BlockType; label: string; icon: string }[] = [
  { type: "paragraph", label: "Paragraph", icon: "¶" },
  { type: "heading", label: "Heading", icon: "H" },
  { type: "code", label: "Code", icon: "</>" },
  { type: "quote", label: "Quote", icon: '"' },
  { type: "image", label: "Image", icon: "⊡" },
  { type: "video", label: "Video", icon: "▷" },
  { type: "link", label: "Link", icon: "⊞" },
  { type: "list", label: "List", icon: "≡" },
  { type: "callout", label: "Callout", icon: "!" },
  { type: "divider", label: "Divider", icon: "—" },
];

const CATEGORIES = ["Design Systems", "Development", "UI/UX", "Tutorials", "Uncategorized"];

let _blockId = 0;
function newId() { return `b${++_blockId}`; }

function defaultBlock(type: BlockType): EditorBlock {
  const data: Record<string, unknown> = (() => {
    switch (type) {
      case "paragraph": return { text: "" };
      case "heading": return { text: "", level: 2 };
      case "code": return { code: "", language: "tsx", filename: "" };
      case "quote": return { text: "", attribution: "" };
      case "image": return { url: "", alt: "", caption: "" };
      case "video": return { url: "", caption: "" };
      case "link": return { url: "", text: "", description: "" };
      case "list": return { items: [""], ordered: false };
      case "callout": return { text: "", variant: "tip" };
      case "divider": return {};
    }
  })();
  return { _id: newId(), type, data };
}

// ── AdminLogin ─────────────────────────────────────────────────────────────────

const AdminLogin: React.FC<{ onLogin: (token: string) => void }> = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError("");
    try {
      const { token } = await adminApi.login(password);
      authStore.set(token);
      onLogin(token);
    } catch {
      setError("Invalid password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ba-login">
      <motion.div
        className="ba-login__card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="ba-login__logo" aria-hidden="true">✦</div>
        <h1 className="ba-login__title">Blog Admin</h1>
        <p className="ba-login__sub">Enter your password to continue</p>

        <form className="ba-login__form" onSubmit={handleSubmit}>
          <div className="ba-login__field">
            <label htmlFor="admin-password" className="ba-login__label">Password</label>
            <input
              id="admin-password"
              type="password"
              className="ba-login__input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
              autoComplete="current-password"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                className="ba-login__error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                role="alert"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button className="ba-btn ba-btn--primary" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// ── BlockEditor ────────────────────────────────────────────────────────────────

interface BlockEditorProps {
  block: EditorBlock;
  index: number;
  total: number;
  onChange: (id: string, data: Record<string, unknown>) => void;
  onMove: (id: string, dir: -1 | 1) => void;
  onDelete: (id: string) => void;
  onUpload: (id: string, field: string, file: File) => void;
}

const BlockEditor: React.FC<BlockEditorProps> = ({ block, index, total, onChange, onMove, onDelete, onUpload }) => {
  const d = block.data;
  const imgRef = useRef<HTMLInputElement>(null);

  const set = (field: string, value: unknown) =>
    onChange(block._id, { ...d, [field]: value });

  const renderInputs = () => {
    switch (block.type) {
      case "paragraph":
        return (
          <textarea
            className="ba-block__textarea"
            placeholder="Write your paragraph…"
            value={(d.text as string) || ""}
            onChange={e => set("text", e.target.value)}
            rows={4}
          />
        );

      case "heading":
        return (
          <div className="ba-block__row">
            <select
              className="ba-block__select ba-block__select--sm"
              value={(d.level as number) || 2}
              onChange={e => set("level", Number(e.target.value))}
            >
              <option value={1}>H1</option>
              <option value={2}>H2</option>
              <option value={3}>H3</option>
              <option value={4}>H4</option>
            </select>
            <input
              className="ba-block__input"
              type="text"
              placeholder="Heading text…"
              value={(d.text as string) || ""}
              onChange={e => set("text", e.target.value)}
            />
          </div>
        );

      case "code":
        return (
          <>
            <div className="ba-block__row">
              <input
                className="ba-block__input ba-block__input--sm"
                type="text"
                placeholder="Language (tsx, js, css…)"
                value={(d.language as string) || ""}
                onChange={e => set("language", e.target.value)}
              />
              <input
                className="ba-block__input"
                type="text"
                placeholder="Filename (optional)"
                value={(d.filename as string) || ""}
                onChange={e => set("filename", e.target.value)}
              />
            </div>
            <textarea
              className="ba-block__textarea ba-block__textarea--code"
              placeholder="Paste your code here…"
              value={(d.code as string) || ""}
              onChange={e => set("code", e.target.value)}
              rows={8}
              spellCheck={false}
            />
          </>
        );

      case "quote":
        return (
          <>
            <textarea
              className="ba-block__textarea"
              placeholder="Quote text…"
              value={(d.text as string) || ""}
              onChange={e => set("text", e.target.value)}
              rows={3}
            />
            <input
              className="ba-block__input"
              type="text"
              placeholder="Attribution (optional)"
              value={(d.attribution as string) || ""}
              onChange={e => set("attribution", e.target.value)}
            />
          </>
        );

      case "image":
        return (
          <>
            <div className="ba-block__row">
              <input
                className="ba-block__input"
                type="url"
                placeholder="Image URL"
                value={(d.url as string) || ""}
                onChange={e => set("url", e.target.value)}
              />
              <button
                type="button"
                className="ba-btn ba-btn--ghost ba-btn--sm"
                onClick={() => imgRef.current?.click()}
              >
                Upload
              </button>
              <input
                ref={imgRef}
                type="file"
                accept="image/*"
                className="ba-block__file-hidden"
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) onUpload(block._id, "url", f);
                }}
              />
            </div>
            {(d.url as string) && (
              <img className="ba-block__preview-img" src={d.url as string} alt="preview" />
            )}
            <input
              className="ba-block__input"
              type="text"
              placeholder="Alt text"
              value={(d.alt as string) || ""}
              onChange={e => set("alt", e.target.value)}
            />
            <input
              className="ba-block__input"
              type="text"
              placeholder="Caption (optional)"
              value={(d.caption as string) || ""}
              onChange={e => set("caption", e.target.value)}
            />
          </>
        );

      case "video":
        return (
          <>
            <input
              className="ba-block__input"
              type="url"
              placeholder="Video URL (YouTube embed, Vimeo, etc.)"
              value={(d.url as string) || ""}
              onChange={e => set("url", e.target.value)}
            />
            <input
              className="ba-block__input"
              type="text"
              placeholder="Caption (optional)"
              value={(d.caption as string) || ""}
              onChange={e => set("caption", e.target.value)}
            />
          </>
        );

      case "link":
        return (
          <>
            <input
              className="ba-block__input"
              type="url"
              placeholder="URL"
              value={(d.url as string) || ""}
              onChange={e => set("url", e.target.value)}
            />
            <input
              className="ba-block__input"
              type="text"
              placeholder="Link text"
              value={(d.text as string) || ""}
              onChange={e => set("text", e.target.value)}
            />
            <textarea
              className="ba-block__textarea"
              placeholder="Description (optional)"
              value={(d.description as string) || ""}
              onChange={e => set("description", e.target.value)}
              rows={2}
            />
          </>
        );

      case "list": {
        const items = (d.items as string[]) || [""];
        return (
          <>
            <div className="ba-block__row ba-block__row--gap">
              <label className="ba-block__checkbox-label">
                <input
                  type="checkbox"
                  checked={Boolean(d.ordered)}
                  onChange={e => set("ordered", e.target.checked)}
                />
                Ordered list
              </label>
            </div>
            {items.map((item, i) => (
              <div key={i} className="ba-block__row">
                <span className="ba-block__list-bullet">{d.ordered ? `${i + 1}.` : "•"}</span>
                <input
                  className="ba-block__input"
                  type="text"
                  placeholder={`Item ${i + 1}`}
                  value={item}
                  onChange={e => {
                    const next = [...items];
                    next[i] = e.target.value;
                    set("items", next);
                  }}
                />
                <button
                  type="button"
                  className="ba-block__icon-btn ba-block__icon-btn--danger"
                  onClick={() => set("items", items.filter((_, j) => j !== i))}
                  aria-label="Remove item"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              className="ba-btn ba-btn--ghost ba-btn--sm"
              onClick={() => set("items", [...items, ""])}
            >
              + Add item
            </button>
          </>
        );
      }

      case "callout":
        return (
          <>
            <select
              className="ba-block__select"
              value={(d.variant as string) || "tip"}
              onChange={e => set("variant", e.target.value)}
            >
              <option value="tip">Tip</option>
              <option value="note">Note</option>
              <option value="warning">Warning</option>
            </select>
            <textarea
              className="ba-block__textarea"
              placeholder="Callout text…"
              value={(d.text as string) || ""}
              onChange={e => set("text", e.target.value)}
              rows={3}
            />
          </>
        );

      case "divider":
        return <div className="ba-block__divider-preview" aria-hidden="true" />;
    }
  };

  return (
    <motion.div
      layout
      className="ba-block"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.22 }}
    >
      <div className="ba-block__header">
        <span className="ba-block__type-badge">
          {BLOCK_TYPES.find(b => b.type === block.type)?.icon} {block.type}
        </span>
        <div className="ba-block__controls">
          <button type="button" className="ba-block__icon-btn" onClick={() => onMove(block._id, -1)} disabled={index === 0} aria-label="Move up">↑</button>
          <button type="button" className="ba-block__icon-btn" onClick={() => onMove(block._id, 1)} disabled={index === total - 1} aria-label="Move down">↓</button>
          <button type="button" className="ba-block__icon-btn ba-block__icon-btn--danger" onClick={() => onDelete(block._id)} aria-label="Delete block">×</button>
        </div>
      </div>
      <div className="ba-block__body">{renderInputs()}</div>
    </motion.div>
  );
};

// ── LivePreview ────────────────────────────────────────────────────────────────

const LivePreview: React.FC<{ title: string; blocks: EditorBlock[] }> = ({ title, blocks }) => (
  <div className="ba-preview">
    <div className="ba-preview__header">
      <span className="ba-preview__label">Preview</span>
    </div>
    <div className="ba-preview__body">
      {title && <h1 className="ba-preview__title">{title}</h1>}
      {blocks.map((b) => {
        const d = b.data;
        switch (b.type) {
          case "paragraph": return <p key={b._id} className="ba-preview__p">{(d.text as string) || <span className="ba-preview__empty">Paragraph…</span>}</p>;
          case "heading": {
            const level = (d.level as number) || 2;
            const text = (d.text as string) || `Heading ${level}`;
            const Tag = `h${level}` as keyof JSX.IntrinsicElements;
            return <Tag key={b._id} className={`ba-preview__h${level}`}>{text}</Tag>;
          }
          case "code": return (
            <pre key={b._id} className="ba-preview__code">
              <code>{(d.code as string) || "// code…"}</code>
            </pre>
          );
          case "quote": return (
            <blockquote key={b._id} className="ba-preview__quote">
              <p>{(d.text as string) || "Quote…"}</p>
              {d.attribution && <cite>— {d.attribution as string}</cite>}
            </blockquote>
          );
          case "image": return d.url
            ? <img key={b._id} className="ba-preview__img" src={d.url as string} alt={(d.alt as string) || ""} />
            : <div key={b._id} className="ba-preview__img-placeholder">Image</div>;
          case "video": return <div key={b._id} className="ba-preview__video-placeholder">Video: {(d.url as string) || "…"}</div>;
          case "list": return (
            <ul key={b._id} className="ba-preview__list">
              {((d.items as string[]) || []).map((item, i) => <li key={i}>{item || "…"}</li>)}
            </ul>
          );
          case "callout": return (
            <div key={b._id} className={`ba-preview__callout ba-preview__callout--${(d.variant as string) || "tip"}`}>
              {(d.text as string) || "Callout…"}
            </div>
          );
          case "divider": return <hr key={b._id} className="ba-preview__hr" />;
          case "link": return <a key={b._id} href={d.url as string} className="ba-preview__link">{(d.text as string) || d.url as string}</a>;
          default: return null;
        }
      })}
      {blocks.length === 0 && <p className="ba-preview__empty">Add content blocks to see a preview.</p>}
    </div>
  </div>
);

// ── PostEditor ─────────────────────────────────────────────────────────────────

interface PostEditorProps {
  editingId: string | null;
  onSaved: () => void;
  onCancel: () => void;
}

const PostEditor: React.FC<PostEditorProps> = ({ editingId, onSaved, onCancel }) => {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [tagsInput, setTagsInput] = useState("");
  const [featured, setFeatured] = useState(false);
  const [blocks, setBlocks] = useState<EditorBlock[]>([]);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [error, setError] = useState("");
  const coverImgRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editingId) return;
    setLoadingPost(true);
    adminApi.getPost(editingId).then(p => {
      setTitle(p.title);
      setExcerpt(p.excerpt);
      setCoverUrl(p.cover_image_url ?? "");
      setCategory(p.category);
      setTagsInput(p.tags.join(", "));
      setFeatured(p.featured);
      setBlocks(
        p.blocks.map(b => ({ _id: newId(), type: b.type as BlockType, data: b.data }))
      );
    }).catch(() => setError("Failed to load post.")).finally(() => setLoadingPost(false));
  }, [editingId]);

  const addBlock = (type: BlockType) => {
    setBlocks(prev => [...prev, defaultBlock(type)]);
    setShowBlockMenu(false);
  };

  const updateBlock = useCallback((id: string, data: Record<string, unknown>) => {
    setBlocks(prev => prev.map(b => b._id === id ? { ...b, data } : b));
  }, []);

  const moveBlock = useCallback((id: string, dir: -1 | 1) => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b._id === id);
      if (idx < 0) return prev;
      const next = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setBlocks(prev => prev.filter(b => b._id !== id));
  }, []);

  const handleMediaUpload = useCallback(async (blockId: string, field: string, file: File) => {
    try {
      const { url } = await adminApi.uploadMedia(file);
      setBlocks(prev => prev.map(b =>
        b._id === blockId ? { ...b, data: { ...b.data, [field]: url } } : b
      ));
    } catch {
      setError("Media upload failed.");
    }
  }, []);

  const buildPayload = (): PostInput => ({
    title,
    excerpt,
    cover_image_url: coverUrl || null,
    category,
    tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
    featured,
    blocks: blocks.map(({ type, data }) => ({ type, data })),
  });

  const handleSave = async () => {
    if (!title.trim()) { setError("Title is required."); return; }
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await adminApi.updatePost(editingId, buildPayload());
      } else {
        await adminApi.createPost(buildPayload());
      }
      onSaved();
    } catch {
      setError("Failed to save post. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!editingId) { await handleSave(); return; }
    setPublishing(true);
    setError("");
    try {
      await adminApi.updatePost(editingId, buildPayload());
      await adminApi.publishPost(editingId);
      onSaved();
    } catch {
      setError("Failed to publish post.");
    } finally {
      setPublishing(false);
    }
  };

  const handleCoverUpload = async (file: File) => {
    try {
      const { url } = await adminApi.uploadMedia(file);
      setCoverUrl(url);
    } catch {
      setError("Cover image upload failed.");
    }
  };

  if (loadingPost) return <div className="ba-loading">Loading post…</div>;

  return (
    <div className="ba-editor">
      {/* Toolbar */}
      <div className="ba-editor__toolbar">
        <button type="button" className="ba-btn ba-btn--ghost" onClick={onCancel}>← Back</button>
        <h2 className="ba-editor__toolbar-title">{editingId ? "Edit Post" : "New Post"}</h2>
        <div className="ba-editor__toolbar-actions">
          <button
            type="button"
            className={`ba-btn ba-btn--ghost${showPreview ? " ba-btn--active" : ""}`}
            onClick={() => setShowPreview(v => !v)}
          >
            {showPreview ? "Hide Preview" : "Preview"}
          </button>
          <button type="button" className="ba-btn ba-btn--ghost" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Draft"}
          </button>
          <button type="button" className="ba-btn ba-btn--primary" onClick={handlePublish} disabled={publishing}>
            {publishing ? "Publishing…" : "Publish"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            className="ba-editor__error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
          >
            {error}
            <button type="button" onClick={() => setError("")} className="ba-editor__error-close">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`ba-editor__layout${showPreview ? " ba-editor__layout--split" : ""}`}>
        {/* Left: Form */}
        <div className="ba-editor__form">
          {/* Metadata */}
          <section className="ba-section">
            <h3 className="ba-section__title">Metadata</h3>

            <label className="ba-label">Title <span className="ba-label__req">*</span></label>
            <input
              className="ba-input"
              type="text"
              placeholder="Post title…"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            <label className="ba-label">Excerpt</label>
            <textarea
              className="ba-input ba-input--textarea"
              placeholder="Short description shown on the blog list…"
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              rows={3}
            />

            <label className="ba-label">Cover Image</label>
            <div className="ba-row">
              <input
                className="ba-input"
                type="url"
                placeholder="https://…"
                value={coverUrl}
                onChange={e => setCoverUrl(e.target.value)}
              />
              <button type="button" className="ba-btn ba-btn--ghost ba-btn--sm" onClick={() => coverImgRef.current?.click()}>
                Upload
              </button>
              <input
                ref={coverImgRef}
                type="file"
                accept="image/*"
                className="ba-block__file-hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleCoverUpload(f); }}
              />
            </div>
            {coverUrl && <img className="ba-cover-preview" src={coverUrl} alt="cover preview" />}

            <div className="ba-row ba-row--gap">
              <div className="ba-field">
                <label className="ba-label">Category</label>
                <select className="ba-input" value={category} onChange={e => setCategory(e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="ba-field">
                <label className="ba-label">Tags (comma-separated)</label>
                <input
                  className="ba-input"
                  type="text"
                  placeholder="React, TypeScript…"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                />
              </div>
            </div>

            <label className="ba-checkbox-label">
              <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} />
              Featured post
            </label>
          </section>

          {/* Content blocks */}
          <section className="ba-section">
            <h3 className="ba-section__title">Content</h3>

            <AnimatePresence>
              {blocks.map((block, i) => (
                <BlockEditor
                  key={block._id}
                  block={block}
                  index={i}
                  total={blocks.length}
                  onChange={updateBlock}
                  onMove={moveBlock}
                  onDelete={deleteBlock}
                  onUpload={handleMediaUpload}
                />
              ))}
            </AnimatePresence>

            {/* Add block button */}
            <div className="ba-add-block">
              <button
                type="button"
                className="ba-btn ba-btn--ghost ba-btn--add"
                onClick={() => setShowBlockMenu(v => !v)}
                aria-expanded={showBlockMenu}
              >
                + Add Block
              </button>

              <AnimatePresence>
                {showBlockMenu && (
                  <motion.div
                    className="ba-block-menu"
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.97 }}
                    transition={{ duration: 0.16 }}
                  >
                    {BLOCK_TYPES.map(({ type, label, icon }) => (
                      <button
                        key={type}
                        type="button"
                        className="ba-block-menu__item"
                        onClick={() => addBlock(type)}
                      >
                        <span className="ba-block-menu__icon">{icon}</span>
                        {label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>

        {/* Right: Preview */}
        {showPreview && <LivePreview title={title} blocks={blocks} />}
      </div>
    </div>
  );
};

// ── PostList ───────────────────────────────────────────────────────────────────

interface PostListProps {
  onNew: () => void;
  onEdit: (id: string) => void;
}

const PostList: React.FC<PostListProps> = ({ onNew, onEdit }) => {
  const [posts, setPosts] = useState<ApiBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    adminApi.getPosts()
      .then(setPosts)
      .catch(() => setError("Failed to load posts."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setActionId(id);
    try {
      await adminApi.deletePost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch {
      setError("Failed to delete post.");
    } finally {
      setActionId(null);
    }
  };

  const handleTogglePublish = async (post: ApiBlogPost) => {
    setActionId(post.id);
    try {
      const updated = post.status === "published"
        ? await adminApi.unpublishPost(post.id)
        : await adminApi.publishPost(post.id);
      setPosts(prev => prev.map(p => p.id === post.id ? updated : p));
    } catch {
      setError("Failed to update post status.");
    } finally {
      setActionId(null);
    }
  };

  const formatDate = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

  return (
    <div className="ba-list">
      <div className="ba-list__header">
        <h2 className="ba-list__title">Posts</h2>
        <button type="button" className="ba-btn ba-btn--primary" onClick={onNew}>
          + New Post
        </button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div className="ba-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="alert">
            {error}
            <button type="button" onClick={() => setError("")} className="ba-error__close">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="ba-loading">Loading posts…</div>
      ) : posts.length === 0 ? (
        <div className="ba-empty">
          <p>No posts yet.</p>
          <button type="button" className="ba-btn ba-btn--primary" onClick={onNew}>Create your first post</button>
        </div>
      ) : (
        <div className="ba-table-wrap">
          <table className="ba-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className={actionId === post.id ? "ba-table__row--loading" : ""}>
                  <td className="ba-table__title">
                    <span>{post.title}</span>
                    {post.featured && <span className="ba-badge ba-badge--featured">Featured</span>}
                  </td>
                  <td><span className="ba-badge">{post.category}</span></td>
                  <td>
                    <span className={`ba-status ba-status--${post.status}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="ba-table__date">
                    {formatDate(post.status === "published" ? post.published_at : post.created_at)}
                  </td>
                  <td>
                    <div className="ba-table__actions">
                      <button
                        type="button"
                        className="ba-btn ba-btn--ghost ba-btn--sm"
                        onClick={() => onEdit(post.id)}
                        disabled={actionId === post.id}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={`ba-btn ba-btn--sm ${post.status === "published" ? "ba-btn--ghost" : "ba-btn--primary"}`}
                        onClick={() => handleTogglePublish(post)}
                        disabled={actionId === post.id}
                      >
                        {post.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        type="button"
                        className="ba-btn ba-btn--danger ba-btn--sm"
                        onClick={() => handleDelete(post.id)}
                        disabled={actionId === post.id}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ── AdminDashboard ─────────────────────────────────────────────────────────────

const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [view, setView] = useState<AdminView>("list");
  const [editingId, setEditingId] = useState<string | null>(null);

  const goToList = () => { setView("list"); setEditingId(null); };
  const goToNew = () => { setEditingId(null); setView("editor"); };
  const goToEdit = (id: string) => { setEditingId(id); setView("editor"); };

  return (
    <div className="ba-dashboard">
      <header className="ba-dashboard__nav">
        <div className="ba-dashboard__brand">
          <span className="ba-dashboard__logo" aria-hidden="true">✦</span>
          <span className="ba-dashboard__brand-name">Blog Admin</span>
        </div>
        <nav className="ba-dashboard__links">
          <button type="button" className={`ba-nav-link${view === "list" ? " ba-nav-link--active" : ""}`} onClick={goToList}>
            Posts
          </button>
          <button type="button" className="ba-nav-link" onClick={goToNew}>
            + New Post
          </button>
        </nav>
        <button type="button" className="ba-btn ba-btn--ghost ba-btn--sm" onClick={onLogout}>
          Sign out
        </button>
      </header>

      <main className="ba-dashboard__main">
        <AnimatePresence mode="wait">
          {view === "list" ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.22 }}
            >
              <PostList onNew={goToNew} onEdit={goToEdit} />
            </motion.div>
          ) : (
            <motion.div
              key="editor"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.22 }}
            >
              <PostEditor editingId={editingId} onSaved={goToList} onCancel={goToList} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

// ── BlogAdmin (root) ───────────────────────────────────────────────────────────

const BlogAdmin: React.FC = () => {
  const [token, setToken] = useState<string | null>(authStore.get);

  const handleLogin = (t: string) => setToken(t);
  const handleLogout = () => { authStore.clear(); setToken(null); };

  return token ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <AdminLogin onLogin={handleLogin} />
  );
};

export default BlogAdmin;
