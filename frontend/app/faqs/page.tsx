import Link from "next/link";
import landingImage from "../OLE_Nepal_front_PAGE.png";

export default function FAQs() {
  const faqs = [
    "How do I start a new chat?",
    "Where can I change the tutor model?",
    "Can I go back to my exercise from this page?",
    "Will my chat history stay saved in this browser?",
  ];

  return (
    <main
      className="relative min-h-screen overflow-hidden px-3 py-3 md:px-4 md:py-4"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(16, 55, 71, 0.9), rgba(12, 36, 48, 0.62)), url(${landingImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,247,223,0.24),transparent_30%)]" />

      <div className="app-shell relative z-10 mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-5xl flex-col overflow-hidden rounded-[30px] border-white/20 bg-[#fff8ec]/86 shadow-[0_28px_80px_rgba(0,0,0,0.22)] backdrop-blur-sm">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[rgba(23,56,69,0.14)] bg-[#103747]/88 px-6 py-6 text-white md:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">
              Help Center
            </p>
            <h1 className="mt-2 text-3xl font-black md:text-5xl">
              Frequently Asked Questions
            </h1>
          </div>

          <Link
            href="/"
            className="rounded-full border border-white/24 bg-white/12 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(0,0,0,0.16)] transition hover:bg-white/18"
          >
            Back to Tutor Bot
          </Link>
        </header>

        <section className="relative flex-1 bg-[linear-gradient(180deg,rgba(255,248,236,0.8)_0%,rgba(253,244,227,0.88)_100%)] px-6 py-8 md:px-8 md:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(241,200,78,0.18),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(29,107,99,0.16),transparent_24%)]" />
          <div className="relative space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq}
                className="rounded-[26px] border border-[rgba(23,56,69,0.12)] bg-white/82 px-6 py-5 text-lg font-semibold text-[#173845] shadow-[0_14px_32px_rgba(23,56,69,0.09)] backdrop-blur-sm cursor-pointer transition hover:bg-white/200"
              >
                {faq}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
