import  { useState } from "react";
import axios from "axios";
import "../styles/chatWidget.scss"; // Make sure you have a matching SCSS/CSS file
import { API_URL } from "../api/api";

type ChatMood = "greeting" | "thinking" | "answering" | "idle" | "idk";


const ChatWidget = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi there! Ask me about my education, experience, or anything else.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // For controlling whether the chat pop-up is open/visible
  const [isOpen, setIsOpen] = useState(false);

  // Define a state for the chat mood which will determine the image shown
  // Mood images
  const [chatMood, setChatMood] = useState<ChatMood>("greeting");

  // Map each mood to its corresponding image
  const imageMapping : Record<ChatMood, string> = {
    greeting: "/hi-me.webp",
    thinking: "/thinking-me.webp",
    answering: "/work-me.webp",
    idle: "/work-me.webp",
    idk: "/idk-me.webp"
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user's message
    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    // Switch to "thinking" mood and set loading
    setChatMood("thinking");
    setLoading(true);

    try {
      // Make your API call
      const response = await axios.post(`${API_URL}/api/chat`, {
        messages: updatedMessages,
      });

      // Add the assistant's response
      const assistantMessage = {
        role: "assistant",
        content: response.data.reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Switch to "answering" mood, then go "idle"
      setChatMood("answering");
      setTimeout(() => {
        setChatMood("idle");
      }, 3000);
    } catch (error) {
      console.error("Error fetching AI response", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
      setChatMood("idle");
    } finally {
      setLoading(false);
    }
  };

  // Optional: if you want the chat to open automatically when the user types
  // you can handle it here:
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    // If chat is closed and user starts typing, open it
    if (!isOpen && e.target.value.trim().length > 0) {
      setIsOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Toggles the chat open or closed
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* 
        This button is shown only when the chat is closed.
        Clicking it will open the chat pop-up.
      */}
      {!isOpen && (
        <button className="open-chat-btn" onClick={toggleChat}>
          Open Chat
        </button>
      )}

      {/* The chat pop-up itself, conditionally visible via CSS class */}
      <div className={`chat-widget ${isOpen ? "open" : ""}`}>
        {/* Close button in top-right corner */}
        <button className="close-btn" onClick={toggleChat}>
          &times;
        </button>

        {/* Example: a simple title or heading */}
        <div className="chat-header">AI Assistant</div>

        {/* The "mood" image */}
        <img
          src={imageMapping[chatMood]}
          alt="Chat mood"
          className="chat-img"
          width="40%"
        />

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.content}
            </div>
          ))}
          {loading && <div className="message assistant">Typing...</div>}
        </div>

        {/* Input and Send Button */}
        <div className="chat-input">
          <input
            type="text"
            placeholder="Ask about my education..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </>
  );
};

export default ChatWidget;
