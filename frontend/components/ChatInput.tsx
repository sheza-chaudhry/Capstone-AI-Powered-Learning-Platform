"use client"

import { useState } from "react"

export default function ChatInput({
  onSend,
}: {
  onSend: (text: string) => void
}) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    onSend(input)
    setInput("")
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me anything about your exercise..."
        className="w-full px-6 py-4 border-black rounded-full bg-white 
        text-black border-black  placeholder:text-black/60 
        focus:outline-none focus:ring-2 "
      />

      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 
        w-10 h-10 bg-[#6CB4E0] rounded-full 
        flex items-center justify-center 
        border-2 border-black 
        hover:bg-[#5BA3CF] transition-colors"
      >
        <span className="t
        ext-white text-xl">↑</span>
      </button>
    </form>
  )
}