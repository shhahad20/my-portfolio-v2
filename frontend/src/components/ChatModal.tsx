import  { useState } from "react";
import axios from "axios";
import { API_URL } from "../api/api";
import "../styles/chatModal.scss";

const ChatModal = ({ closeModal }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi there! Ask me about my education, experience, or anything else.",
    },
  ]);
  const [input, setInput] = useState("");
  // Loading spinner / typing indicator
  const [loading, setLoading] = useState(false);

  // Mood images
  const [chatMood, setChatMood] = useState("greeting");

  // Map each mood to its corresponding image
  const imageMapping = {
    greeting: "/hi-me.webp",
    thinking: "/thinking-me.webp",
    answering: "/work-me.webp",
    idle: "/work-me.webp",
    idk: "/idk-me.webp"
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
      const response = await axios.post(`${API_URL}/api/chat`, {
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
            <img src="logo-blue-light.svg" alt="AI Logo" width="20%" />
            <h2>Shahad's AI</h2>
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
              {msg.content}
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
