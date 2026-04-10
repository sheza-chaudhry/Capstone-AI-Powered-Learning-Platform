"use client";

import { useEffect, useRef, useState } from "react";
import { DEFAULT_MODEL_ID, MODEL_STORAGE_KEY, getModelById } from "../lib/models";
import {
  ForgotPasswordPage,
  LandingPage,
  LoginPage,
  SignupPage,
} from "../components/home/AuthViews";
import { ChatShell } from "../components/home/ChatShell";
import {
  GUEST_ACTIVE_CHAT_STORAGE_KEY,
  GUEST_CHAT_STORAGE_KEY,
  GUEST_PREVIEW_STORAGE_KEY,
  TOKEN_STORAGE_KEY,
  USERNAME_STORAGE_KEY,
  createChat,
  getCurrentTime,
  getStoredProfile,
  saveStoredProfile,
} from "../components/home/home-utils";
import {
  AuthScreen,
  ChatSession,
  LoginResult,
  Message,
  SignupPayload,
} from "../components/home/types";
import landingImage from "./OLE_Nepal_front_PAGE.png";

export default function Home() {
  const [allChats, setAllChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedModelId, setSelectedModelId] = useState(DEFAULT_MODEL_ID);
  const [authChecked, setAuthChecked] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [authScreen, setAuthScreen] = useState<AuthScreen>("landing");
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [isGuestPreview, setIsGuestPreview] = useState(false);
  const selectedModelIdRef = useRef(selectedModelId);

  const activeChat = allChats.find((chat) => chat.id === activeChatId) ?? null;
  const selectedModel = getModelById(selectedModelId);
  const studentProfile = getStoredProfile(currentUsername);

  useEffect(() => {
    selectedModelIdRef.current = selectedModelId;
  }, [selectedModelId]);

  useEffect(() => {
    const savedModel =
      window.localStorage.getItem(MODEL_STORAGE_KEY) ?? DEFAULT_MODEL_ID;
    setSelectedModelId(savedModel);
    setAuthToken(window.localStorage.getItem(TOKEN_STORAGE_KEY));
    setCurrentUsername(window.localStorage.getItem(USERNAME_STORAGE_KEY));
    setIsGuestPreview(
      window.localStorage.getItem(GUEST_PREVIEW_STORAGE_KEY) === "true",
    );
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    const syncModelSelection = () => {
      const modelId =
        window.localStorage.getItem(MODEL_STORAGE_KEY) ?? DEFAULT_MODEL_ID;
      setSelectedModelId(modelId);
    };

    window.addEventListener("storage", syncModelSelection);
    return () => window.removeEventListener("storage", syncModelSelection);
  }, []);

  useEffect(() => {
    if (!authChecked || authToken || !isGuestPreview) {
      return;
    }

    const savedChats = window.sessionStorage.getItem(GUEST_CHAT_STORAGE_KEY);
    const savedActiveChatId = window.sessionStorage.getItem(
      GUEST_ACTIVE_CHAT_STORAGE_KEY,
    );

    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats) as ChatSession[];

        if (parsedChats.length > 0) {
          setAllChats(parsedChats);
          setActiveChatId(
            savedActiveChatId &&
              parsedChats.some((chat) => chat.id === savedActiveChatId)
              ? savedActiveChatId
              : parsedChats[0].id,
          );
          return;
        }
      } catch (error) {
        console.error("Failed to restore guest preview chats", error);
      }
    }

    const previewChat = createChat(selectedModelIdRef.current);
    setAllChats([previewChat]);
    setActiveChatId(previewChat.id);
  }, [authChecked, authToken, isGuestPreview]);

  useEffect(() => {
    if (!isGuestPreview) {
      window.sessionStorage.removeItem(GUEST_CHAT_STORAGE_KEY);
      window.sessionStorage.removeItem(GUEST_ACTIVE_CHAT_STORAGE_KEY);
      return;
    }

    if (allChats.length === 0) {
      return;
    }

    window.sessionStorage.setItem(
      GUEST_CHAT_STORAGE_KEY,
      JSON.stringify(allChats),
    );

    if (activeChatId) {
      window.sessionStorage.setItem(
        GUEST_ACTIVE_CHAT_STORAGE_KEY,
        activeChatId,
      );
    }
  }, [allChats, activeChatId, isGuestPreview]);

  useEffect(() => {
    if (!authChecked || !authToken || isGuestPreview) {
      return;
    }

    let cancelled = false;

    async function loadSessions() {
      try {
        const response = await fetch("http://localhost:8000/auth/sessions", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed with status ${response.status}`);
        }

        const sessions = (await response.json()) as Array<{
          session_id: number;
          title: string;
        }>;

        if (cancelled) {
          return;
        }

        const loadedChats: ChatSession[] = sessions.map((session) => ({
          id: crypto.randomUUID(),
          title: session.title,
          messages: [],
          sessionId: session.session_id,
        }));

        const newChat = createChat(selectedModelIdRef.current);
        setAllChats([newChat, ...loadedChats]);
        setActiveChatId(newChat.id);
      } catch (error) {
        console.error("Failed to load sessions", error);

        if (cancelled) {
          return;
        }

        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
        window.localStorage.removeItem(USERNAME_STORAGE_KEY);
        setAuthToken(null);
        setCurrentUsername(null);
        setAuthScreen("login");
        setAuthNotice("Your session expired. Please log in again.");
      }
    }

    void loadSessions();

    return () => {
      cancelled = true;
    };
  }, [authChecked, authToken, isGuestPreview]);

  function createNewChat() {
    const newChat = createChat(selectedModelId);
    setAllChats((previous) => [newChat, ...previous]);
    setActiveChatId(newChat.id);
  }

  async function handleSelectChat(chat: ChatSession) {
    setActiveChatId(chat.id);

    if (chat.sessionId && chat.messages.length === 0 && authToken) {
      try {
        const response = await fetch(
          `http://localhost:8000/auth/sessions/${chat.sessionId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Failed with status ${response.status}`);
        }

        const data = (await response.json()) as {
          messages: Message[];
        };

        setAllChats((previous) =>
          previous.map((currentChat) =>
            currentChat.id === chat.id
              ? { ...currentChat, messages: data.messages }
              : currentChat,
          ),
        );
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    }
  }

  async function handleSend(userMessage: string) {
    if (!activeChatId) {
      return;
    }

    const userTime = getCurrentTime();

    setAllChats((previous) =>
      previous.map((chat) =>
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
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers,
        body: JSON.stringify({
          question: userMessage,
          history: activeChat?.messages || [],
          session_id: activeChat?.sessionId || null,
          model_id: selectedModelId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = (await response.json()) as {
        answer?: string;
        session_id?: number;
      };

      setAllChats((previous) =>
        previous.map((chat) =>
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
                      "I am ready to help once the backend answer is available.",
                    time: getCurrentTime(),
                  },
                ],
              }
            : chat,
        ),
      );
    } catch (error) {
      console.error("Failed to reach backend:", error);

      setAllChats((previous) =>
        previous.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    role: "bot",
                    text: `I saved your question and would answer with the ${selectedModel.name} once the backend is connected again.`,
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
    const chat = allChats.find((currentChat) => currentChat.id === chatId);

    if (chat?.sessionId && authToken) {
      try {
        await fetch(`http://localhost:8000/auth/sessions/${chat.sessionId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      } catch (error) {
        console.error("Failed to delete session from backend:", error);
      }
    }

    setAllChats((previous) => {
      const filtered = previous.filter((currentChat) => currentChat.id !== chatId);

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

  async function handleLogin(
    username: string,
    password: string,
  ): Promise<LoginResult> {
    if (!username || !password) {
      return {
        ok: false,
        error: "Please enter your username and password.",
      };
    }

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = (await response.json()) as {
        access_token?: string;
        username?: string;
        detail?: string;
      };

      if (!response.ok || !data.access_token) {
        return {
          ok: false,
          error: data.detail ?? "Invalid username or password.",
        };
      }

      window.localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
      window.localStorage.setItem(USERNAME_STORAGE_KEY, data.username ?? username);
      setAuthToken(data.access_token);
      setCurrentUsername(data.username ?? username);
      setAuthNotice(null);
      return { ok: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        ok: false,
        error: "Unable to reach the server right now. Please try again.",
      };
    }
  }

  async function handleSignup(payload: SignupPayload): Promise<LoginResult> {
    if (!payload.name || !payload.username || !payload.password || !payload.grade) {
      return {
        ok: false,
        error: "Please complete every required field before creating the account.",
      };
    }

    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: payload.username,
          password: payload.password,
        }),
      });

      const data = (await response.json()) as {
        detail?: string;
      };

      if (!response.ok) {
        return {
          ok: false,
          error: data.detail ?? "Unable to create the account.",
        };
      }

      saveStoredProfile(payload.username, {
        name: payload.name,
        grade: payload.grade,
      });
      setAuthScreen("login");
      setAuthNotice(
        `Account created for ${payload.name}. Log in with the username "${payload.username}".`,
      );
      return { ok: true };
    } catch (error) {
      console.error("Signup error:", error);
      return {
        ok: false,
        error: "Unable to reach the server right now. Please try again.",
      };
    }
  }

  function handleLogout() {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(USERNAME_STORAGE_KEY);
    window.localStorage.removeItem(GUEST_PREVIEW_STORAGE_KEY);
    window.sessionStorage.removeItem(GUEST_CHAT_STORAGE_KEY);
    window.sessionStorage.removeItem(GUEST_ACTIVE_CHAT_STORAGE_KEY);
    setAuthToken(null);
    setCurrentUsername(null);
    setIsGuestPreview(false);
    setAllChats([]);
    setActiveChatId(null);
    setIsSidebarOpen(true);
    setAuthScreen("landing");
    setAuthNotice(null);
  }

  function handleGuestPreview() {
    const previewChat = createChat(selectedModelId);
    window.localStorage.setItem(GUEST_PREVIEW_STORAGE_KEY, "true");
    window.sessionStorage.setItem(
      GUEST_CHAT_STORAGE_KEY,
      JSON.stringify([previewChat]),
    );
    window.sessionStorage.setItem(GUEST_ACTIVE_CHAT_STORAGE_KEY, previewChat.id);
    setIsGuestPreview(true);
    setCurrentUsername("Guest Preview");
    setAllChats([previewChat]);
    setActiveChatId(previewChat.id);
    setAuthNotice(null);
  }

  function handleReturnToLanding() {
    setAuthNotice(null);
    setAuthScreen("landing");
  }

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--page-bg)] text-lg font-semibold text-[var(--ink)]">
        Loading Tutor Bot...
      </div>
    );
  }

  if (!authToken && !isGuestPreview) {
    if (authScreen === "login") {
      return (
        <LoginPage
          landingImageSrc={landingImage.src}
          notice={authNotice}
          onSubmit={handleLogin}
          onHome={handleReturnToLanding}
          onSignup={() => {
            setAuthNotice(null);
            setAuthScreen("signup");
          }}
          onForgotPassword={() => {
            setAuthNotice(null);
            setAuthScreen("forgot");
          }}
        />
      );
    }

    if (authScreen === "signup") {
      return (
        <SignupPage
          landingImageSrc={landingImage.src}
          onSubmit={handleSignup}
          onHome={handleReturnToLanding}
          onLogin={() => {
            setAuthNotice(null);
            setAuthScreen("login");
          }}
        />
      );
    }

    if (authScreen === "forgot") {
      return (
        <ForgotPasswordPage
          landingImageSrc={landingImage.src}
          onHome={handleReturnToLanding}
          onSignup={() => setAuthScreen("signup")}
          onBackToLogin={() => setAuthScreen("login")}
        />
      );
    }

    return (
      <LandingPage
        landingImageSrc={landingImage.src}
        onLogin={() => setAuthScreen("login")}
        onSignup={() => setAuthScreen("signup")}
        onGuest={handleGuestPreview}
      />
    );
  }

  return (
    <ChatShell
      landingImageSrc={landingImage.src}
      allChats={allChats}
      activeChatId={activeChatId}
      currentUsername={currentUsername}
      studentProfile={studentProfile}
      isGuestPreview={isGuestPreview}
      isSidebarOpen={isSidebarOpen}
      selectedModelShortName={selectedModel.shortName}
      messages={activeChat?.messages ?? []}
      isBotThinking={isBotThinking}
      onCreateNewChat={createNewChat}
      onSelectChat={handleSelectChat}
      onDeleteChat={deleteChat}
      onToggleSidebar={() => setIsSidebarOpen((previous) => !previous)}
      onLogout={handleLogout}
      onSend={handleSend}
    />
  );
}
