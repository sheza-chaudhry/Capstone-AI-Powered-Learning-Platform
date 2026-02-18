// Template in use
import { useState } from "react"; // React hook that lets you add a state variable to component
import { sendMessage } from "../services/mockApi";

// Purpose: Manages Chat Logic 
export function useChat() {
    // Messages state, initially empty array
    const [messages, setMessages] = useState([]);

    // Loading state, initially set to false
    // Tracks whether the API call is in progress
    const [loading, setLoading] = useState(false);

    // Called when user submits a message
    const send = async (text) => {
        const userMsg = { role: "user", content: text };
        setMessages((m) => [...m, userMsg]); // append to current list of messages
        setLoading(true); 

        try {
        const botReply = await sendMessage([...messages, userMsg]);
        setMessages((m) => [...m, botReply]);
        } finally {
        setLoading(false);
        }
    };

    return { messages, send, loading };
}
