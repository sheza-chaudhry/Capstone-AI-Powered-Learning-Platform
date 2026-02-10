// Template in use
import { useState } from "react";
import { sendMessage } from "../services/mockApi";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const send = async (text) => {
    const userMsg = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    try {
      const botReply = await sendMessage([...messages, userMsg]);
      setMessages((m) => [...m, botReply]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, send, loading };
}
