import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import Navbar from "./components/Navbar";
import { useChat } from "./hooks/useChat";



export default function App() {
  const { messages, send, loading } = useChat();

  // Template in use
  return (
    <div className="app">
      <Navbar/>
      <ChatWindow  className="" messages={messages} />
      <ChatInput  className="" onSend={send} disabled={loading} />
    </div>
  );
}
