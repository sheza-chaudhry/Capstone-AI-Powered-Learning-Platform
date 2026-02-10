import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import { useChat } from "./hooks/useChat";

export default function App() {
  const { messages, send, loading } = useChat();

  // Template in use
  return (
    <div className="app">
      <ChatWindow  className="center" messages={messages} />
      <ChatInput  className="center" onSend={send} disabled={loading} />
    </div>
  );
}
