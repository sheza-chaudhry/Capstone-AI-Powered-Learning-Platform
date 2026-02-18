// src/components/ChatWindow.jsx
// Template in use
// Purpose: Display chat messages
// Props:   messages - array of strings (user and chatbot responses)
export default function ChatWindow({ messages }) {
    return (
      <div className="chat-window">
        {/* m = message object, i = index of message object*/}
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {/* Inserting message text/content */}
            <div className="msg-bubble"> 
                {m.content}
            </div>
          </div>
        ))}
      </div>
    );
  }
  