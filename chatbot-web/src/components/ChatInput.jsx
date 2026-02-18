// src/components/ChatInput.jsx
// Template in use
// useState - store internal data
import { useState } from "react";

// Purpose: Take user input
// Props:   onSend - Function passed from parent component
//          disabled - Boolean used to disable the input/Send button
export default function ChatInput({ onSend, disabled }) {
    // text - current input value
    // setText - function to update text
    const [text, setText] = useState("");

    // Runs when the form below is submitted
    const submit = (e) => {
        e.preventDefault(); // Prevents page refresh
        if (!text.trim()) return; // Prevents Submission of White Space
        onSend(text); // Calls the parent function
        setText(""); // Reset/clear input
    };

    return (
        <form onSubmit={submit} className="chat-input">
        <input className="chat-input-txt-box"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            disabled={disabled}
        />
        <button disabled={disabled}>Send</button>
        </form>
    );
}
