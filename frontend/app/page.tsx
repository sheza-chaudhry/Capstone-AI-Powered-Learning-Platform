"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ChatWindow from "../components/ChatWindow";
import { DEFAULT_MODEL_ID, getModelById } from "../lib/models";

type Message = {
  role: "user" | "bot";
  text: string;
  time: string;
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  sessionId: number | null; // backend session id, null for guests or new chats
};

const STORAGE_KEY = "chatSessions";
const MODEL_STORAGE_KEY = "selectedModelId";

function getCurrentTime() {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function createWelcomeMessages(modelId: string): Message[] {
  const model = getModelById(modelId);
  return [
    {
      role: "bot",
      text: `Hi there! I'm your tutor today.\nLet's learn something cool!\nWhat are you hoping to work on?`,
      time: getCurrentTime(),
    },
    {
      role: "bot",
      text: `You're currently previewing the ${model.name}. You can change models anytime from Settings.`,
      time: getCurrentTime(),
    },
  ];
}

function createChat(modelId: string): ChatSession {
  return {
    id: crypto.randomUUID(),
    title: "New Chat",
    messages: createWelcomeMessages(modelId),
    sessionId: null, // new chats have no backend session yet
  };
}

export default function Home() {
  const [allChats, setAllChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // frontend team default
  const [selectedModelId, setSelectedModelId] = useState(DEFAULT_MODEL_ID);

  const activeChat = allChats.find((chat) => chat.id === activeChatId) ?? null;
  const selectedModel = getModelById(selectedModelId);

  // Initialize: load model, then check auth and load sessions
  useEffect(() => {
    const savedModel =
      window.localStorage.getItem(MODEL_STORAGE_KEY) ?? DEFAULT_MODEL_ID;
    setSelectedModelId(savedModel);

    const token = localStorage.getItem("token");

    if (token) {
      // logged in — load past sessions from backend
      fetch("http://localhost:8000/auth/sessions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((sessions) => {
          const loadedChats: ChatSession[] = sessions.map((s: any) => ({
            id: crypto.randomUUID(),
            title: s.title,
            messages: [],
            sessionId: s.session_id,
          }));

          const newChat = createChat(savedModel);
          setAllChats([newChat, ...loadedChats]);
          setActiveChatId(newChat.id);
        })
        .catch(() => {
          // if fetch fails fall back to a fresh chat
          const newChat = createChat(savedModel);
          setAllChats([newChat]);
          setActiveChatId(newChat.id);
        });
    } else {
      // guest — check sessionStorage first, otherwise start fresh
      const savedChats = window.sessionStorage.getItem(STORAGE_KEY);
      if (savedChats) {
        try {
          const parsed = JSON.parse(savedChats) as ChatSession[];
          if (parsed.length > 0) {
            setAllChats(parsed);
            setActiveChatId(parsed[0].id);
            return;
          }
        } catch (error) {
          console.error("Failed to parse saved chats", error);
        }
      }

      const firstChat = createChat(savedModel);
      setAllChats([firstChat]);
      setActiveChatId(firstChat.id);
    }
  }, []);

  // Persist chats to sessionStorage (guests only — logged in users use the db)
  useEffect(() => {
    if (allChats.length > 0) {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(allChats));
    }
  }, [allChats]);

  // Sync model selection across tabs
  useEffect(() => {
    const syncModelSelection = () => {
      const modelId =
        window.localStorage.getItem(MODEL_STORAGE_KEY) ?? DEFAULT_MODEL_ID;
      setSelectedModelId(modelId);
    };

    window.addEventListener("storage", syncModelSelection);
    return () => window.removeEventListener("storage", syncModelSelection);
  }, []);

  function createNewChat() {
    const newChat = createChat(selectedModelId);
    setAllChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  }

  // Load messages from backend when a student clicks a past session
  async function handleSelectChat(chat: ChatSession) {
    setActiveChatId(chat.id);

    // only fetch if it's a saved session with no messages loaded yet
    if (chat.sessionId && chat.messages.length === 0) {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          `http://localhost:8000/auth/sessions/${chat.sessionId}/messages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();

        setAllChats((prev) =>
          prev.map((c) =>
            c.id === chat.id ? { ...c, messages: data.messages } : c,
          ),
        );
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    }
  }

  async function handleSend(userMessage: string) {
    if (!activeChatId) return;

    const userTime = getCurrentTime();

    setAllChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              title:
                chat.title === "New Chat"
                  ? userMessage.slice(0, 28) || "New Chat"
                  : chat.title,
              messages: [
                ...chat.messages,
                { role: "user", text: userMessage, time: userTime },
              ],
            }
          : chat,
      ),
    );

    setIsBotThinking(true);

    try {
      // build headers — add token only if logged in
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers,
        body: JSON.stringify({
          question: userMessage,
          history: activeChat?.messages || [],
          session_id: activeChat?.sessionId || null,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();

      setAllChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                sessionId: data.session_id ?? chat.sessionId,
                messages: [
                  ...chat.messages,
                  {
                    role: "bot",
                    text:
                      data.answer ??
                      "I'm ready once the backend is connected.",
                    time: getCurrentTime(),
                  },
                ],
              }
            : chat,
        ),
      );
    } catch (error) {
      console.error("Failed to reach backend:", error);

      setAllChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    role: "bot",
                    text: `Frontend preview mode: I saved your message and would answer with the ${selectedModel.name} once the backend is connected.`,
                    time: getCurrentTime(),
                  },
                ],
              }
            : chat,
        ),
      );
    } finally {
      setIsBotThinking(false);
    }
  }

  async function deleteChat(chatId: string) {
    const chat = allChats.find((c) => c.id === chatId);

    // if it's a saved session, delete from backend too
    if (chat?.sessionId) {
      const token = localStorage.getItem("token");
      try {
        await fetch(
          `http://localhost:8000/auth/sessions/${chat.sessionId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } catch (error) {
        console.error("Failed to delete session from backend:", error);
      }
    }

    // remove from frontend state
    setAllChats((prev) => {
      const filtered = prev.filter((c) => c.id !== chatId);

      if (filtered.length === 0) {
        const replacementChat = createChat(selectedModelId);
        setActiveChatId(replacementChat.id);
        return [replacementChat];
      }

      if (activeChatId === chatId) {
        setActiveChatId(filtered[0].id);
      }

      return filtered;
    });
  }

  return (
    <main className="app-shell w-full min-h-screen flex overflow-hidden">
      <aside
        className={`border-r-2 border-[var(--ink)] bg-[var(--panel)] transition-all duration-300 ${
          isSidebarOpen ? "w-[280px]" : "w-0 overflow-hidden border-r-0"
        }`}
      >
        <div className="flex h-full flex-col gap-4 p-4">
          <button
            onClick={createNewChat}
            className="pill-button w-full cursor-pointer"
          >
            + New Chat
          </button>

          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {allChats.map((chat) => (
              <div key={chat.id} className="flex items-center gap-2">
                <button
                  onClick={() => handleSelectChat(chat)}
                  className={`chat-session-button ${
                    chat.id === activeChatId
                      ? "bg-[var(--accent)]"
                      : "bg-[var(--accent-soft)]"
                  }`}
                >
                  <span className="truncate">{chat.title}</span>
                </button>

                <button
                  onClick={() => deleteChat(chat.id)}
                  className="delete-chat-button"
                  aria-label={`Delete ${chat.title}`}
                >
                  🗑
                </button>
              </div>
            ))}
          </div>

          <div className="sidebar-footer-card space-y-3 pt-2">
            <Link
              href="/settings"
              className="settings-link w-full justify-center"
            >
              <span className="text-2xl leading-none">⚙</span>
              <span className="font-semibold">Settings</span>
            </Link>

            <div className="flex items-center gap-2 text-sm text-black/70">
              <div>
                <div className="font-semibold text-black">Current model</div>
                <div>{selectedModel.shortName}</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <section className="flex flex-1 flex-col bg-[var(--chat-bg)]">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[var(--ink)] px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="circle-icon-button"
              aria-label="Toggle sidebar"
            >
              ☰
            </button>

            <button className="pill-button px-6 cursor-pointer">
              Back to Exercise
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/faqs" className="pill-button px-6 cursor-pointer">
              FAQs
            </Link>

            <div className="flex items-center gap-2 rounded-full border-2 border-[var(--ink)] bg-white px-3 py-2 shadow-[0_4px_12px_rgba(26,26,26,0.08)]">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-[var(--accent)]">
                🤖
              </div>
              <div>
                <div className="text-sm font-semibold leading-tight">
                  Tutor Bot
                </div>
                <div className="text-xs text-black/60">
                  {selectedModel.shortName}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 px-4 py-5 md:px-6 md:py-6">
          <ChatWindow
            messages={activeChat?.messages ?? []}
            onSend={handleSend}
            isBotThinking={isBotThinking}
          />
        </div>
      </section>
    </main>
  );
}