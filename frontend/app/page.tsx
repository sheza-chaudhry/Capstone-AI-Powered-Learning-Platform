"use client";

import { useState, useEffect } from "react";
import ChatWindow from "../components/ChatWindow";
import Link from "next/link";

type Message = {
  role: "user" | "bot";
  text: string;
  time: string;
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
};

export default function Home() {
  const [allChats, setAllChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 👈 new state

  const activeChat = allChats.find((c) => c.id === activeChatId);

  // Initialize: load saved chats, then prepend a new chat
  useEffect(() => {
    const saved = sessionStorage.getItem("chatSessions");
    let existingChats: ChatSession[] = [];

    if (saved) {
      try {
        existingChats = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved chats", e);
      }
    }

    const newChat: ChatSession = {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [],
    };

    const updatedChats = [newChat, ...existingChats];
    setAllChats(updatedChats);
    setActiveChatId(newChat.id);
  }, []);

  // Persist chats
  useEffect(() => {
    if (allChats.length > 0) {
      sessionStorage.setItem("chatSessions", JSON.stringify(allChats));
    }
  }, [allChats]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev); // 👈 toggle function

  function createNewChat() {
    const newChat: ChatSession = {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [],
    };
    setAllChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    // Optionally keep sidebar open after creating a new chat – we leave it as is
  }

  function handleSend(userMessage: string) {
    if (!activeChatId) return;

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setAllChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              title:
                chat.messages.length === 0
                  ? userMessage.slice(0, 25)
                  : chat.title,
              messages: [
                ...chat.messages,
                { role: "user", text: userMessage, time },
              ],
            }
          : chat
      )
    );

    setIsBotThinking(true);

    setTimeout(() => {
      const botTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const botReply = `You said: "${userMessage}"`; // placeholder

      setAllChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { role: "bot", text: botReply, time: botTime },
                ],
              }
            : chat
        )
      );

      setIsBotThinking(false);
    }, 1500);
  }

  function deleteChat(chatId: string) {
    setAllChats((prev) => {
      const filtered = prev.filter((chat) => chat.id !== chatId);

      // If no chats left, create a new one (shouldn't happen normally, but just in case)
      if (filtered.length === 0) {
        const newChat: ChatSession = {
          id: crypto.randomUUID(),
          title: "New Chat",
          messages: [],
        };
        setActiveChatId(newChat.id); 
        return [newChat];
      }
      // If the deleted chat was active, set active to the first remaining chat
      if (activeChatId === chatId) {
        setActiveChatId(filtered[0].id);
      }

      return filtered;
    });
 
}
  return (
    <main className="flex h-screen">
      {/* Main container takes full height, no outer margins/background */}
      <div className="flex-1 border-4 border-black bg-[#E8F4F8] rounded-lg flex">
        {/* 👇 Sidebar – rendered only when open */}
        {isSidebarOpen && (
          <div className="w-64 border-r-4 border-black bg-white p-4 flex flex-col">
            <button
              onClick={createNewChat}
              className="mb-4 px-4 py-2 bg-[#A8D5E2] 
              hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] cursor-pointer 
              transition-all text-black rounded-full"
            >
              + New Chat
            </button>

            <div className="flex-1 overflow-y-auto space-y-2">
              {allChats.map((chat) => (
                <div key={chat.id} className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveChatId(chat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg border-2 border-black ${
                      chat.id === activeChatId ? "bg-[#A8D5E2]" : "bg-white"
                    }`}
                  >
                    {chat.title}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                    className="w-8 h-8 flex items-center justify-center bg-red-300 text-white rounded-full border-2 border-black hover:bg-red-600 transition-colors"
                    aria-label="Delete chat"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Area – always visible, flex-1 ensures it fills remaining space */}
        <div className="flex-1 flex flex-col">
          {/* Header with hamburger button and existing elements */}
          <div className="flex justify-between items-center p-6 border-b-2 border-black">
            <div className="flex items-center gap-2">
              {/* Hamburger button to toggle sidebar */}
              <button
                onClick={toggleSidebar}
                className="text-2xl w-10 h-10 flex items-center justify-center rounded-full border-2 border-black bg-white hover:bg-gray-100"
                aria-label="Toggle sidebar"
              >
                ☰
              </button>
              <button className="back-btn px-8 py-3 bg-[#A8D5E2] text-black font-semibold 
            rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] 
            hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] cursor-pointer transition-all">
                Back to Exercise
              </button>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/faqs"
                className="back-btn px-8 py-3 bg-[#A8D5E2] text-black font-semibold 
            rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] 
            hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] cursor-pointer transition-all"
              >
                FAQs
              </Link>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#6CB4E0] rounded-full border-2 border-black flex items-center justify-center">
                  🤖
                </div>
                <span className="font-bold text-black">Tutor Bot 😊</span>
              </div>
            </div>
          </div>

          {/* ChatWindow container */}
          <div className="flex-1 px-6 pb-6 min-h-0">
            <ChatWindow
              messages={activeChat?.messages || []}
              onSend={handleSend}
              isBotThinking={isBotThinking}
            />
          </div>
        </div>
      </div>
    </main>
  );
}