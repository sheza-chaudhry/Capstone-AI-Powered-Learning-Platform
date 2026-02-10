// Template in use
export async function sendMessage(messages) {
    // TEMP: replace with backend 
    await new Promise((r) => setTimeout(r, 600));
  
    return {
      role: "assistant",
      content: "Hello! I'm your chatbot 🤖",
    };
  }
  