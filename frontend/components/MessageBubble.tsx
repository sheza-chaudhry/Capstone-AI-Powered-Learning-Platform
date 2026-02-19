import { Message } from '../lib/types'
import MathRenderer from './MathRenderer'

export default function MessageBubble({ message }: { message: Message }) {
  return (
    <div className={`bubble ${message.role}`}>
      <MathRenderer content={message.content} />
    </div>
  )
}
