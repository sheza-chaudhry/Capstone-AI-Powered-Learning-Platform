"use client";

import { useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import MathRenderer from "./MathRenderer";


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
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-1">
        <div className="mx-auto flex h-full max-w-5xl flex-col">
          <div className="flex-1 space-y-5 pb-8">
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
    
                  {/* <div className="whitespace-pre-line text-[15px] leading-7 text-black">
                    <MathRenderer content={message.text} />
                  </div> */}
                  {message.role === "bot" ? (
                    <div className="text-[15px] leading-7 text-black">
                      <MathRenderer content={message.text} />
                    </div>
                  ) : (
                    <p className=" text-[15px] leading-7 text-black">
                      {message.text}
                    </p>
                  )}
                  {message.latencyMs && (
                    <div className="text-xs text-black/45">
                     <span className="font-semibold">
                      {(message.latencyMs / 1000).toFixed(1)}s
                    </span>{" "} response time
                    </div>
                  )}
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

          <div className="sticky bottom-0 bg-[var(--chat-bg)] px-2 py-4">
            <ChatInput onSend={onSend} />
          </div>
        </div>
      </div>
    </div>
  );
}
