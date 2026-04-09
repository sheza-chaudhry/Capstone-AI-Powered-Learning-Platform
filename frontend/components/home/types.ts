export type Message = {
  role: "user" | "bot";
  text: string;
  time: string;
};

export type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  sessionId: number | null;
};

export type AuthScreen = "landing" | "login" | "signup" | "forgot";

export type StudentProfile = {
  name: string;
  grade: string;
};

export type LoginResult = {
  ok: boolean;
  error?: string;
};

export type SignupPayload = {
  name: string;
  username: string;
  password: string;
  grade: string;
};
