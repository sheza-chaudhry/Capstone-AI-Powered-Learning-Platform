'use client'

import { useState, useRef, useEffect } from 'react'
import { Message } from '../lib/types'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([])
    const messagesEndRef = useRef<HTMLDivElement>(null)

  
  const sendMessage = async (text: string) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    }
    

    setMessages((prev) => [...prev, newMessage])

    // For now, simulate a bot response after a delay
    setTimeout(() => {
      const botResponse: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Response from Model...',
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        })
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])


  return (
    <div className="h-full flex flex-col px-20">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block px-6 py-4 rounded-[30px] border-2 border-black ${
                message.role === 'user' 
                  ? 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]' 
                  : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]'
              }`}>
                <p className="text-black text-base">{message.content}</p>
              </div>
              <p className="text-black text-sm mt-1 px-2">{message.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input at bottom */}
      <div className="p-6 flex items-center gap-3">
        <button className="w-12 h-12 rounded-full border-2 border-black bg-white flex items-center justify-center text-2xl hover:bg-gray-50 transition-colors">
          😊
        </button>
        <div className="flex-1 relative">
          <form onSubmit={(e) => {
            e.preventDefault()
            const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement
            if (input.value.trim()) {
              sendMessage(input.value)
              input.value = ''
            }
          }}>
            <input 
              name="message"
              type="text" 
              placeholder="What questions do you have for me?"
              className="w-full px-6 py-4 border-2 border-black rounded-full bg-white placeholder:text-black
               text-black caret-black focus:outline-none focus:ring-2 focus:ring-blue-300 focus:placeholder:opacity-0"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#6CB4E0] cursor-pointer rounded-full flex items-center justify-center border-2 border-black hover:bg-[#5BA3CF] transition-colors"
            >
              <span className="text-white text-xl">↑</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}