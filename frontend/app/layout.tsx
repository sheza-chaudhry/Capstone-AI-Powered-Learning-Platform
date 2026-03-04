import './globals.css'

export const metadata = {
  title: 'Math Tutor Chatbot',
  description: 'AI-powered math tutoring assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
