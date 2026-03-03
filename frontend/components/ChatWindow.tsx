"use client";

import { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";

type Message = {
  role: "user" | "bot";
  text: string;
  time: string;
};

export default function ChatWindow({
  messages,
  onSend,
  isBotThinking, // new prop from parent
}: {
  messages: Message[];
  onSend: (text: string) => void;
  isBotThinking: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const isStartScreen = messages.length === 0;

  // Auto-scroll to bottom whenever messages or thinking state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotThinking]);

  function handleSend(text: string) {
    onSend(text); // simply pass the message up; parent handles thinking and bot reply
  }

  return (
    <div className="flex flex-col h-full">
      {isStartScreen ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="text-3xl text-black font-bold mb-4">Ask me anything! 🌟</h1>
          <div className="w-full max-w-2xl">
            <ChatInput onSend={handleSend} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="px-4 py-2 bg-white border1 text-black border-black rounded-2xl shadow-md max-w-[70%]">
                  {msg.text}
                  {/* Optional: display time in small text */}
                  <div className="text-xs text-gray-500 mt-1">{msg.time}</div>
                </div>
              </div>
            ))}

            {/* Bot thinking indicator - shown when isBotThinking is true */}
            {isBotThinking && (
              <div className="flex items-center gap-2">
                🤖
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-black rounded-full animate-pulse [animation-delay:150ms]"></div>
                  <div className="w-2 h-2 bg-black rounded-full animate-pulse [animation-delay:300ms]"></div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="p-4 border-t-2 ">
            <ChatInput onSend={handleSend} />
          </div>
        </div>
      )}
    </div>
  );
}