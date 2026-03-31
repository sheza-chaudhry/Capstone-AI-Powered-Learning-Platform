import Link from "next/link";

export default function FAQs() {
  const faqs = [
    "How do I start a new chat?",
    "Where can I change the tutor model?",
    "Can I go back to my exercise from this page?",
    "Will my chat history stay saved in this browser?",
  ];

  return (
    <main className="min-h-screen bg-[var(--page-bg)] p-4 md:p-6">
      <div className="app-shell mx-auto flex min-h-[calc(100vh-2rem)] max-w-5xl flex-col rounded-[28px] bg-[var(--chat-bg)] p-6 md:p-8">
        <div className="mb-8 flex justify-start">
          <Link href="/" className="pill-button px-6">
            Back to Math Tutor
          </Link>
        </div>

        <h1 className="mb-8 text-center text-3xl font-black">
          Frequently Asked Questions
        </h1>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq}
              className="rounded-full border-2 border-[var(--ink)] bg-white px-6 py-4 text-lg shadow-[0_8px_20px_rgba(26,26,26,0.08)]"
            >
              {faq}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
