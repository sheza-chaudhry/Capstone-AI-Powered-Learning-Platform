export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp?: string  // Add this line
}

