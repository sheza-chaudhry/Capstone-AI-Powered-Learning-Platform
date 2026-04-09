"use client";

import { useState } from "react";

export default function ChatInput({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const [input, setInput] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-5xl">
      <div className="chat-input-shell relative">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask me anything about your exercise..."
          className="w-full rounded-full border-2 border-[rgba(23,56,69,0.16)] bg-white/90 py-4 pl-6 pr-16 text-[15px] text-black shadow-[0_8px_20px_rgba(26,26,26,0.08)] outline-none placeholder:text-black/45 focus:border-[#173845]"
        />

        <button type="submit" className="send-button" aria-label="Send message">
          ↑
        </button>
      </div>
    </form>
  );
}
