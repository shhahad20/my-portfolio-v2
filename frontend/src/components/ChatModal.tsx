import { useState } from "react";
import axios from "axios";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { API_URL } from "../api/api";
import "../styles/chatModal.scss";

// Define the types for the moods
type ChatMood = "greeting" | "thinking" | "answering" | "idle" | "idk";

// Define the props for ChatModal
interface ChatModalProps {
  closeModal: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ closeModal }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi there! Ask me about Shahad's education, experience, or anything else.",
    },
  ]);
  const [input, setInput] = useState("");
  // Loading spinner / typing indicator
  const [loading, setLoading] = useState(false);

  // Mood images
  const [chatMood, setChatMood] = useState<ChatMood>("greeting");

  // Map each mood to its corresponding image
  const imageMapping: Record<ChatMood, string> = {
    greeting: "/hi-me.webp",
    thinking: "/thinking-me.webp",
    answering: "/work-me.webp",
    idle: "/work-me.webp",
    idk: "/idk-me.webp",
  };

  // Custom markdown components with proper typing
  const markdownComponents: Components = {
    p: ({ children }) => <p className="message-paragraph">{children}</p>,
    strong: ({ children }) => (
      <strong className="message-bold">{children}</strong>
    ),
    ul: ({ children }) => <ul className="message-list">{children}</ul>,
    ol: ({ children }) => <ol className="message-list-ordered">{children}</ol>,
    li: ({ children }) => <li className="message-list-item">{children}</li>,
    a: ({ children, href }) => (
      <a
        className="message-link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    code: ({ children, className }) => {
      const isInline = !className;
      return isInline ? (
        <code className="message-code-inline">{children}</code>
      ) : (
        <code className="message-code-block">{children}</code>
      );
    },
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    // Switch to "thinking" mood and set loading
    setChatMood("thinking");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        messages: updatedMessages,
      });
      const assistantMessage = {
        role: "assistant",
        content: response.data.reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      // Switch to "answering" mood, then go "idle"
      setChatMood("answering");
      setTimeout(() => {
        setChatMood("idle");
      }, 5000);
    } catch (error) {
      console.error("Error fetching AI response", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
      setChatMood("idk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal">
        {/* Header with a title and a close (X) button */}
        <div className="chat-header">
          <div className="chat-title">
            {" "}
            {/* <img src="logo-blue-light.svg" alt="AI Logo" width="20%" /> */}
            <h2>Shahad's AI Assistant</h2>
          </div>
          <button className="close-btn" onClick={closeModal}>
            &times;
          </button>
        </div>
        <div className="chat-mood-container">
          <img
            src={imageMapping[chatMood]}
            alt="Chat mood"
            className="chat-mood-img"
          />
        </div>
        {/* Conversation area */}
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          ))}
          {loading && <div className="message assistant">Typing...</div>}
        </div>

        {/* Input row */}
        <div className="chat-input">
          <input
            type="text"
            placeholder="Ask your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <button onClick={handleSend}>
            <img src="/right-arrow.svg" alt="Right Arrow" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
