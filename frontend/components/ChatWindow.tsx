"use client";

import { useEffect, useRef } from "react";
import ChatInput from "./ChatInput";

type Message = {
  role: "user" | "bot";
  text: string;
  time: string;
};

export default function ChatWindow({
  messages,
  onSend,
  isBotThinking,
}: {
  messages: Message[];
  onSend: (text: string) => void;
  isBotThinking: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotThinking]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex-1 overflow-y-auto px-1">
        <div className="mx-auto flex min-h-full max-w-5xl flex-col">
          <div className="chat-thread-panel flex-1 space-y-5 pb-8">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${message.time}-${index}`}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`message-bubble ${
                    message.role === "user"
                      ? "message-bubble-user"
                      : "message-bubble-bot"
                  }`}
                >
                  <p className="whitespace-pre-line text-[15px] leading-7 text-black">
                    {message.text}
                  </p>
                  <div className="mt-2 text-xs text-black/45">{message.time}</div>
                </div>
              </div>
            ))}

            {isBotThinking && (
              <div className="flex justify-start">
                <div className="message-bubble message-bubble-bot inline-flex items-center gap-2">
                  <span className="text-sm font-medium text-black/70">
                    Tutor Bot is thinking
                  </span>
                  <span className="thinking-dot [animation-delay:0ms]" />
                  <span className="thinking-dot [animation-delay:150ms]" />
                  <span className="thinking-dot [animation-delay:300ms]" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="sticky bottom-0 px-2 py-4">
            <ChatInput onSend={onSend} />
          </div>
        </div>
      </div>
    </div>
  );
}
