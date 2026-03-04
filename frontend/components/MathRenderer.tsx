import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

export default function MathRenderer({ content }: { content: string }) {
  const hasBlockMath = content.includes('$$')

  if (hasBlockMath) {
    return <BlockMath math={content.replace(/\$\$/g, '')} />
  }

  return <InlineMath math={content} />
}
