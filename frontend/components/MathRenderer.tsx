import 'katex/dist/katex.min.css'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

export default function MathRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        p: ({ children }) => (
          <p className="mb-3 last:mb-0 leading-7 text-[15px] text-black whitespace-pre-line">
            {children}
          </p>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}