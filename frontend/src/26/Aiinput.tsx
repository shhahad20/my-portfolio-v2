import React, { useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./style/AIInput.scss";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface AIInputProps {
  /** Placeholder text inside the textarea */
  placeholder?: string;
  /** Called when the user submits a non-empty query */
  onSubmit?: (value: string) => void;
  /** Maximum rows before the textarea scrolls */
  maxRows?: number;
  /** Disable the input while waiting for a response */
  disabled?: boolean;
  /** Optional class override for the wrapper */
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const LINE_HEIGHT = 22; // px — must match $ai-line-height in AIInput.scss

function calcMaxHeight(maxRows: number): number {
  return LINE_HEIGHT * maxRows + 24; // 24 = top + bottom padding
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const AIInput: React.FC<AIInputProps> = ({
  placeholder = "Ask anything about me…",
  onSubmit,
  maxRows = 6,
  disabled = false,
  className = "",
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const hasContent = value.trim().length > 0;

  // ── Auto-resize ──────────────────────────────────────────────────────────────
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, calcMaxHeight(maxRows))}px`;
  }, [maxRows]);

  useEffect(() => {
    autoResize();
  }, [value, autoResize]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit?.(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  }, [value, disabled, onSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <motion.div
      className={`ai-input-premium ${isFocused ? "ai-input-premium--focused" : ""} ${
        disabled ? "ai-input-premium--disabled" : ""
      } ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      role="search"
    >
      {/* ── Glow ring (renders behind everything) ─────────────────────────────── */}
      <AnimatePresence>
        {isFocused && (
          <motion.span
            className="ai-input-premium__glow"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ── Inner shell ───────────────────────────────────────────────────────── */}
      <div className="ai-input-premium__shell">
        {/* Top row: AI brand icon + hint ───────────────────────────── */}
        <div className="ai-input-premium__top">
          {/* Flame / brand icon */}
          <span className="ai-input-premium__brand" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 15.94 16.51"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M1.13,1.71C2.29.59,4.96.44,6.5.57c1.73.15,3.41.63,4.84,1.61.14.09.56.47.66.46.1,0,.89-.61.91-.69.07-.22-.16-.31-.27-.47-.25-.35-.22-.77.2-.96C13.08.4,15.1-.01,15.35,0c.32.02.54.24.59.55-.22.7-.38,1.53-.66,2.21-.1.25-.19.49-.5.54-.51.07-.7-.44-.88-.41-1.36,1.13-2.88,2-4.64,2.37-2.1.45-6.61.41-8.23-1.21-.73-.73-.63-1.64.09-2.34ZM10.61,3.26s-.41-.26-.48-.3c-1.87-1.1-5.66-1.57-7.63-.6-.84.42-.75.74.03,1.13,1.86.93,6,.95,7.87.04.11-.06.3-.11.2-.27Z"
              />
              <path
                fill="currentColor"
                d="M12.77,5.05c1.1-.2.96,1.64.79,2.29-1.06,4.12-8.94,4.56-12.12,3.27-1.68-.68-2-2.31-.39-3.3,2.3-1.43,7.49-.97,10.06-.34.2.05.9.32,1.03.27.19-.06.23-.78.22-.96-.01-.24-.12-.48-.07-.73.04-.22.26-.46.48-.5ZM4.35,7.73c-.72.05-2.23.32-2.77.81s.11.76.58.93c1.67.59,4.72.53,6.45.16.91-.2,1.89-.55,2.58-1.19.02-.08-.06-.1-.11-.12-.24-.11-.74-.2-1.01-.26-1.73-.35-3.94-.46-5.71-.34Z"
              />
              <path
                fill="currentColor"
                d="M4.49,12.15c2.97-.29,3.24,4.12.41,4.36s-3.22-4.09-.41-4.36Z"
              />
              <path
                fill="currentColor"
                d="M14.09,12.63c-1.1,1.21-3.15,2.05-4.73,2.35-.53.1-1.45.32-1.46-.52-.01-.74.87-.67,1.37-.8,1.41-.34,4.34-1.38,4.47-3.11.04-.57-.57-1.12-.07-1.57.58-.52,1.07.09,1.25.63.38,1.13-.06,2.18-.82,3.02Z"
              />
            </svg>
          </span>

          <span className="ai-input-premium__label">Ask AI</span>
        </div>

        {/* Textarea ─────────────────────────────────────────────────── */}
        <textarea
          ref={textareaRef}
          className="ai-input-premium__textarea"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={1}
          disabled={disabled}
          aria-label="Ask AI for information about Shahad"
          aria-multiline="true"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />

        {/* Bottom action row ────────────────────────────────────────── */}
        <div className="ai-input-premium__actions">
          {/* Hint text */}
          <AnimatePresence mode="wait">
            {hasContent ? (
              <motion.span
                key="shift-hint"
                className="ai-input-premium__hint"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
              >
                Shift + Enter for new line
              </motion.span>
            ) : (
              <motion.span
                key="idle-hint"
                className="ai-input-premium__hint"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
              >
                Press Enter to send
              </motion.span>
            )}
          </AnimatePresence>

          {/* Send button */}
          <motion.button
            className={`ai-input-premium__send ${
              hasContent ? "ai-input-premium__send--active" : ""
            }`}
            type="button"
            onClick={handleSubmit}
            disabled={!hasContent || disabled}
            aria-label="Send query"
            whileHover={hasContent ? { scale: 1.08 } : {}}
            whileTap={hasContent ? { scale: 0.93 } : {}}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
          >
            {/* Arrow up icon */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 12V2M7 2L3 6M7 2L11 6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default AIInput;