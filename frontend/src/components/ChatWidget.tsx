import  { useState } from "react";
import axios from "axios";
import "../styles/chatWidget.scss"; 
import { API_URL } from "../api/api";

const ChatWidget = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi there! Ask me about my education, experience, or anything else.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
  
    setMessages((prev) => [...prev, userMessage]); // Update UI immediately
    setInput("");
    setLoading(true);
  
    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        messages: [userMessage], // Send only the latest message
      });
  
      const assistantMessage = {
        role: "assistant",
        content: response.data.reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error fetching AI response", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="chat-widget">
      <img src="/hi-me.webp" alt="My memoji" width="40%"className="chat-img"/>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {loading && <div className="message assistant">Typing...</div>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask about my education..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatWidget;
