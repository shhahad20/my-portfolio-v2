import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./style/aichatwidget.scss";

// ─────────────────────────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────────────────────────

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isError?: boolean;
}

export interface AIChatWidgetProps {
  /** Controls open/close state from the parent */
  isOpen: boolean;
  /** Callback fired when the widget requests to close */
  onClose: () => void;
  /** Displayed name in the widget header */
  assistantName?: string;
  /** Short description shown while idle */
  assistantTagline?: string;
  /** System prompt sent to the API */
  systemPrompt?: string;
  /** Pre-populated quick-action prompts shown in the welcome state */
  quickPrompts?: string[];
  /** Additional CSS class on the root element */
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_SYSTEM_PROMPT =
  "You are an AI assistant for Shahad Altharwa's personal portfolio website. " +
  "Shahad is a Software Engineer & Designer based in Saudi Arabia. " +
  "Answer questions about their work, skills, and experience in a concise, " +
  "professional, and friendly way. Keep responses brief and helpful.";

const DEFAULT_QUICK_PROMPTS = [
  "What's your tech stack?",
  "Tell me about your projects",
  "What are your skills?",
  "Let's collaborate",
];

// ─────────────────────────────────────────────────────────────────────────────
// Small helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/** Minimal inline formatter: newlines → <br>, **bold**, `code` */
function formatContent(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\n)/g);
  return parts.map((part, i) => {
    if (part === "\n") return <br key={i} />;
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={i}>{part.slice(1, -1)}</code>;
    return part;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

const SparkleIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 2L9.5 9.5L2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
  </svg>
);

const SendIcon: React.FC = () => (
  <svg
    width={15}
    height={15}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg
    width={15}
    height={15}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const ResetIcon: React.FC = () => (
  <svg
    width={15}
    height={15}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

const AIChatWidget: React.FC<AIChatWidgetProps> = ({
  isOpen,
  onClose,
  assistantName = "Shahad AI Assistant",
  assistantTagline,
  systemPrompt = DEFAULT_SYSTEM_PROMPT,
  quickPrompts = DEFAULT_QUICK_PROMPTS,
  className = "",
}) => {
  const uid = useId();
  const dialogId = `ai-widget-dialog-${uid}`;
  const inputId = `ai-widget-input-${uid}`;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /** Stored as parallel array to avoid re-building on every render */
  const apiHistoryRef = useRef<{ role: string; content: string }[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  // ── Effects ────────────────────────────────────────────────────────────────

  /** Scroll to latest message */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  /** Focus management on open */
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => textareaRef.current?.focus(), 80);
    return () => clearTimeout(timer);
  }, [isOpen]);

  /** Escape key handler */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  /** Focus trap */
  const handleFocusTrap = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Tab") return;
      const widget = e.currentTarget;
      const focusable = Array.from(
        widget.querySelectorAll<HTMLElement>(
          "button:not([disabled]), textarea:not([disabled]), [tabindex='0']"
        )
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    []
  );

  // ── Core send logic ────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    async (overrideText?: string) => {
      const text = (overrideText ?? input).trim();
      if (!text || isLoading) return;

      // Optimistically add the user message
      const userMsg: Message = {
        id: `${Date.now()}-user`,
        role: "user",
        content: text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      apiHistoryRef.current = [
        ...apiHistoryRef.current,
        { role: "user", content: text },
      ];

      setIsLoading(true);

      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: systemPrompt,
            messages: apiHistoryRef.current,
          }),
        });

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          throw new Error(
            (errBody as { error?: { message?: string } }).error?.message ??
              `API error ${response.status}`
          );
        }

        const data = await response.json() as {
          content?: Array<{ text?: string }>;
        };
        const replyText =
          data.content?.[0]?.text ?? "Sorry, I couldn't generate a response.";

        const assistantMsg: Message = {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: replyText,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        apiHistoryRef.current = [
          ...apiHistoryRef.current,
          { role: "assistant", content: replyText },
        ];
      } catch (err: unknown) {
        const errorText =
          err instanceof Error && err.message.includes("Failed to fetch")
            ? "Unable to connect. Please check your internet connection."
            : err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";

        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-error`,
            role: "assistant",
            content: errorText,
            timestamp: new Date(),
            isError: true,
          },
        ]);
        // Roll back the API history for the failed turn
        apiHistoryRef.current = apiHistoryRef.current.slice(0, -1);
      } finally {
        setIsLoading(false);
        textareaRef.current?.focus();
      }
    },
    [input, isLoading, systemPrompt]
  );

  // ── Input handlers ─────────────────────────────────────────────────────────

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const handleClear = () => {
    setMessages([]);
    apiHistoryRef.current = [];
    textareaRef.current?.focus();
  };

  // ── Derived state ──────────────────────────────────────────────────────────

  const showWelcome = messages.length === 0;
  const canSend = input.trim().length > 0 && !isLoading;
  const statusLabel = isLoading ? "Thinking…" : (assistantTagline ?? "Online · Ready to help");

  // ── Animation variants ─────────────────────────────────────────────────────

  const widgetVariants = {
    hidden: {
      opacity: 0,
      scale: 0.91,
      y: 18,
      transformOrigin: "bottom right",
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 310, damping: 26, mass: 0.85 },
    },
    exit: {
      opacity: 0,
      scale: 0.94,
      y: 12,
      transition: { duration: 0.22, ease: [0.4, 0, 1, 1] as number[] },
    },
  };

  const msgVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 420, damping: 32 },
    },
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Mobile backdrop ── */}
          <motion.div
            className="ai-widget__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* ── Widget panel ── */}
          <motion.div
            id={dialogId}
            className={`ai-widget ${className}`.trim()}
            variants={widgetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-label={assistantName}
            aria-modal="true"
            onKeyDown={handleFocusTrap}
          >
            {/* ── HEADER ─────────────────────────────────────────────────── */}
            <header className="ai-widget__header">
              <div className="ai-widget__avatar" aria-hidden="true">
                <SparkleIcon size={17} />
              </div>

              <div className="ai-widget__header-info">
                <span className="ai-widget__header-name">{assistantName}</span>
                <span
                  className="ai-widget__header-status"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {statusLabel}
                </span>
              </div>

              <div className="ai-widget__header-actions">
                {messages.length > 0 && (
                  <button
                    ref={firstFocusRef}
                    className="ai-widget__icon-btn"
                    onClick={handleClear}
                    aria-label="Clear conversation"
                    title="Clear"
                    type="button"
                  >
                    <ResetIcon />
                  </button>
                )}
                <button
                  className="ai-widget__icon-btn"
                  onClick={onClose}
                  aria-label="Close AI assistant"
                  type="button"
                >
                  <CloseIcon />
                </button>
              </div>
            </header>

            {/* ── MESSAGES ───────────────────────────────────────────────── */}
            <div
              className="ai-widget__messages"
              role="log"
              aria-live="polite"
              aria-label="Conversation history"
            >
              {/* Welcome card */}
              {showWelcome && (
                <motion.div
                  className="ai-widget__welcome"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                >
                  <div className="ai-widget__welcome-icon" aria-hidden="true">
                    <SparkleIcon size={20} />
                  </div>
                  <h3 className="ai-widget__welcome-title">
                    How can I assist you?
                  </h3>
                  <p className="ai-widget__welcome-desc">
                    Ask me anything about Shahad's work, skills, or projects.
                  </p>
                  <div
                    className="ai-widget__quick-actions"
                    role="group"
                    aria-label="Quick prompts"
                  >
                    {quickPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        className="ai-widget__quick-btn"
                        onClick={() => void sendMessage(prompt)}
                        type="button"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Message list */}
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    className={`ai-widget__message ai-widget__message--${msg.role}`}
                    variants={msgVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div
                      className={[
                        "ai-widget__bubble",
                        `ai-widget__bubble--${msg.role}`,
                        msg.isError ? "ai-widget__bubble--error" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {formatContent(msg.content)}
                    </div>
                    <time
                      className="ai-widget__msg-time"
                      dateTime={msg.timestamp.toISOString()}
                    >
                      {formatTime(msg.timestamp)}
                    </time>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    className="ai-widget__message ai-widget__message--assistant"
                    variants={msgVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0 }}
                    aria-label="Assistant is typing"
                  >
                    <div className="ai-widget__typing" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Scroll anchor */}
              <div ref={messagesEndRef} aria-hidden="true" />
            </div>

            {/* ── INPUT AREA ─────────────────────────────────────────────── */}
            <footer className="ai-widget__input-area">
              <div className="ai-widget__input-wrapper">
                <textarea
                  ref={textareaRef}
                  id={inputId}
                  className="ai-widget__textarea"
                  value={input}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything…"
                  rows={1}
                  maxLength={2000}
                  disabled={isLoading}
                  aria-label="Message input"
                  aria-multiline="true"
                  aria-describedby={`${inputId}-hint`}
                />
                <button
                  className={[
                    "ai-widget__send-btn",
                    isLoading ? "ai-widget__send-btn--loading" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => void sendMessage()}
                  disabled={!canSend}
                  aria-label="Send message"
                  type="button"
                >
                  {isLoading ? (
                    <span className="ai-widget__spinner" aria-hidden="true" />
                  ) : (
                    <SendIcon />
                  )}
                </button>
              </div>

              <div className="ai-widget__input-footer" id={`${inputId}-hint`}>
                <span
                  className="ai-widget__char-count"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {input.length > 1800 ? `${input.length} / 2000` : ""}
                </span>
                <span className="ai-widget__input-hint">
                  <kbd>⇧ Enter</kbd> new line · <kbd>Enter</kbd> send
                </span>
              </div>
            </footer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIChatWidget;