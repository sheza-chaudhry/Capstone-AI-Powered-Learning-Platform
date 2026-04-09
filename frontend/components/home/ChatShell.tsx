"use client";

import Link from "next/link";
import { LogOut, Settings } from "lucide-react";
import ChatWindow from "../ChatWindow";
import { ChatSession, Message, StudentProfile } from "./types";

export function ChatShell({
  landingImageSrc,
  allChats,
  activeChatId,
  currentUsername,
  studentProfile,
  isGuestPreview,
  isSidebarOpen,
  selectedModelShortName,
  messages,
  isBotThinking,
  onCreateNewChat,
  onSelectChat,
  onDeleteChat,
  onToggleSidebar,
  onLogout,
  onSend,
}: Readonly<{
  landingImageSrc: string;
  allChats: ChatSession[];
  activeChatId: string | null;
  currentUsername: string | null;
  studentProfile: StudentProfile | null;
  isGuestPreview: boolean;
  isSidebarOpen: boolean;
  selectedModelShortName: string;
  messages: Message[];
  isBotThinking: boolean;
  onCreateNewChat: () => void;
  onSelectChat: (chat: ChatSession) => void;
  onDeleteChat: (chatId: string) => void;
  onToggleSidebar: () => void;
  onLogout: () => void;
  onSend: (message: string) => void;
}>) {
  return (
    <main
      className="relative h-[100dvh] overflow-hidden px-3 py-3 md:px-4 md:py-4"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(16, 55, 71, 0.9), rgba(12, 36, 48, 0.62)), url(${landingImageSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,247,223,0.24),transparent_30%)]" />

      <div className="app-shell relative z-10 flex h-full w-full overflow-hidden rounded-[30px] border-white/20 bg-[#fff8ec]/86 shadow-[0_28px_80px_rgba(0,0,0,0.22)] backdrop-blur-sm">
        <aside
          className={`min-h-0 border-r-2 border-[rgba(23,56,69,0.16)] bg-[#fff4df]/88 transition-all duration-300 ${
            isSidebarOpen ? "w-[290px]" : "w-0 overflow-hidden border-r-0"
          }`}
        >
          <div className="flex h-full min-h-0 flex-col gap-4 p-4">
            <button
              onClick={onCreateNewChat}
              className="pill-button w-full cursor-pointer bg-[linear-gradient(180deg,#f5d870_0%,#f1c84e_100%)]"
            >
              + New Chat
            </button>

            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {allChats.map((chat) => (
                <div key={chat.id} className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectChat(chat)}
                    className={`chat-session-button ${
                      chat.id === activeChatId
                        ? "bg-[var(--accent)]"
                        : "bg-[var(--accent-soft)]"
                    }`}
                  >
                    <span className="truncate">{chat.title}</span>
                  </button>

                  <button
                    onClick={() => onDeleteChat(chat.id)}
                    className="delete-chat-button"
                    aria-label={`Delete ${chat.title}`}
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>

            <div className="sidebar-footer-card space-y-3 pt-3">
              <div className="rounded-[22px] border-2 border-[rgba(23,56,69,0.18)] bg-white/78 px-4 py-3 shadow-[0_8px_18px_rgba(51,65,75,0.08)] backdrop-blur-sm">
                <div className="text-sm font-semibold text-black">
                  {studentProfile?.name ?? currentUsername ?? "Student"}
                </div>
                <div className="text-sm text-black/65">
                  {isGuestPreview
                    ? "Preview mode"
                    : studentProfile?.grade
                      ? `Grade ${studentProfile.grade}`
                      : currentUsername}
                </div>
              </div>

              <button
                onClick={onLogout}
                className="settings-link w-full cursor-pointer justify-center gap-2 bg-[linear-gradient(180deg,#ffdfb9_0%,#f8c993_100%)]"
              >
                <LogOut size={18} strokeWidth={2.5} />
                <span className="font-semibold">
                  {isGuestPreview ? "Exit Preview" : "Log Out"}
                </span>
              </button>
            </div>

            <div className="sidebar-footer-card space-y-3 pt-3">
              <Link
                href="/settings"
                className="settings-link w-full justify-center bg-[linear-gradient(180deg,#d6ebe5_0%,#b7ddd2_100%)]"
              >
                <Settings size={18} strokeWidth={2.5} />
                <span className="font-semibold">Settings</span>
              </Link>

              <div className="flex items-center gap-2 text-sm text-black/70">
                <div>
                  <div className="font-semibold text-black">Current model</div>
                  <div>{selectedModelShortName}</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="relative flex min-h-0 flex-1 flex-col bg-[linear-gradient(180deg,rgba(255,248,236,0.8)_0%,rgba(253,244,227,0.88)_100%)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(241,200,78,0.18),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(29,107,99,0.16),transparent_24%)]" />
          <header className="relative flex flex-wrap items-center justify-between gap-4 border-b-2 border-[rgba(23,56,69,0.14)] bg-[#103747]/88 px-4 py-4 text-white md:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={onToggleSidebar}
                className="circle-icon-button bg-white text-[#173845]"
                aria-label="Toggle sidebar"
              >
                ☰
              </button>

              <div className="rounded-full border border-white/24 bg-white/12 px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_8px_18px_rgba(0,0,0,0.16)]">
                OLE Nepal Tutor Bot
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/faqs"
                className="rounded-full border border-white/24 bg-white/12 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(0,0,0,0.16)] transition hover:bg-white/18"
              >
                FAQs
              </Link>

              <div className="flex items-center gap-2 rounded-full border border-white/24 bg-white/12 px-3 py-2 shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/24 bg-[#f1c84e]">
                  🤖
                </div>
                <div>
                  <div className="text-sm font-semibold leading-tight text-white">
                    Tutor Bot
                  </div>
                  <div className="text-xs text-white/75">
                    {selectedModelShortName}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="relative min-h-0 flex-1 overflow-hidden px-4 py-5 md:px-6 md:py-6">
            <ChatWindow
              messages={messages}
              onSend={onSend}
              isBotThinking={isBotThinking}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
