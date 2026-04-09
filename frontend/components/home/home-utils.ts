import { getModelById } from "../../lib/models";
import { ChatSession, Message, StudentProfile } from "./types";

export const TOKEN_STORAGE_KEY = "token";
export const USERNAME_STORAGE_KEY = "currentUsername";
export const PROFILE_STORAGE_KEY = "studentProfiles";
export const GUEST_PREVIEW_STORAGE_KEY = "guestPreviewMode";

export function getCurrentTime() {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function createWelcomeMessages(modelId: string): Message[] {
  const model = getModelById(modelId);
  return [
    {
      role: "bot",
      text:
        "Namaste! I am your OLE Nepal Tutor Bot.\nI can help you review ideas, practice step by step, and explain tough topics clearly.",
      time: getCurrentTime(),
    },
    {
      role: "bot",
      text: `You are currently using the ${model.name}. Ask a question whenever you are ready to learn.`,
      time: getCurrentTime(),
    },
  ];
}

export function createChat(modelId: string): ChatSession {
  return {
    id: crypto.randomUUID(),
    title: "New Chat",
    messages: createWelcomeMessages(modelId),
    sessionId: null,
  };
}

export function getStoredProfiles(): Record<string, StudentProfile> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, StudentProfile>) : {};
  } catch (error) {
    console.error("Failed to read stored profiles", error);
    return {};
  }
}

export function saveStoredProfile(username: string, profile: StudentProfile) {
  const profiles = getStoredProfiles();
  profiles[username] = profile;
  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profiles));
}

export function getStoredProfile(username: string | null) {
  if (!username) {
    return null;
  }

  return getStoredProfiles()[username] ?? null;
}
