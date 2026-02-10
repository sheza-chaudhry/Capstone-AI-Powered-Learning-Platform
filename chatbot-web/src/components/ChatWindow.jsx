// src/components/ChatWindow.jsx
// Template in use
export default function ChatWindow({ messages }) {
    return (
      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.content}
          </div>
        ))}
      </div>
    );
  }
  