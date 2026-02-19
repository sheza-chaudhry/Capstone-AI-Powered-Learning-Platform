'use client'

import { useState } from 'react'

export default function ChatInput({
  onSend,
}: {
  onSend: (text: string) => void
}) {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    onSend(input)
    setInput('')
  }

  return (
    <div className="chat-input">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask a math question..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  )
}
