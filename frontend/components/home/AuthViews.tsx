"use client";

import { FormEvent, ReactNode, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { LoginResult, SignupPayload } from "./types";

function AuthShell({
  children,
  landingImageSrc,
}: Readonly<{
  children: ReactNode;
  landingImageSrc: string;
}>) {
  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(16, 55, 71, 0.88), rgba(12, 36, 48, 0.6)), url(${landingImageSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,247,223,0.28),transparent_35%)]" />
      <div className="relative z-10 w-full max-w-6xl">{children}</div>
    </main>
  );
}

function BrandBar({
  action,
  onHome,
}: Readonly<{
  action?: ReactNode;
  onHome?: () => void;
}>) {
  return (
    <div className="mb-6 flex items-center justify-between rounded-[28px] border-2 border-white/30 bg-[#103747]/90 px-5 py-4 text-white shadow-[0_18px_48px_rgba(0,0,0,0.18)] backdrop-blur-sm md:px-7">
      <button
        type="button"
        onClick={onHome}
        className="rounded-xl text-left transition hover:opacity-90"
      >
        <div className="text-2xl font-black tracking-tight cursor-pointer">OLE Nepal</div>
        <div className="text-sm text-white/80 cursor-pointer">Tutor Bot</div>
      </button>
      {action}
    </div>
  );
}

function FormField({
  label,
  children,
}: Readonly<{
  label: string;
  children: ReactNode;
}>) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#173845]">
        {label}
      </span>
      {children}
    </label>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
  required = true,
}: Readonly<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggle: () => void;
  required?: boolean;
}>) {
  return (
    <FormField label={label}>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          className="w-full rounded-2xl border-2 border-[#7aa3b6] bg-white px-4 py-3 pr-12 text-[#173845] outline-none transition focus:border-[#173845]"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1d6b63]"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </FormField>
  );
}

function AuthCard({
  title,
  subtitle,
  children,
  landingImageSrc,
  onHome,
}: Readonly<{
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
  landingImageSrc: string;
  onHome?: () => void;
}>) {
  return (
    <AuthShell landingImageSrc={landingImageSrc}>
      <BrandBar onHome={onHome} />
      <div className="mx-auto max-w-xl rounded-[32px] border border-white/28 bg-[#fff8ec]/94 p-8 shadow-[0_28px_70px_rgba(0,0,0,0.2)] backdrop-blur-sm md:p-10">
        <h1 className="text-center text-4xl font-black text-[#173845] md:text-5xl">
          {title}
        </h1>
        <div className="mt-3 text-center text-sm text-[#355866]">{subtitle}</div>
        <div className="mt-8">{children}</div>
      </div>
    </AuthShell>
  );
}

export function LandingPage({
  landingImageSrc,
  onLogin,
  onSignup,
  onGuest,
}: Readonly<{
  landingImageSrc: string;
  onLogin: () => void;
  onSignup: () => void;
  onGuest: () => void;
}>) {
  return (
    <AuthShell landingImageSrc={landingImageSrc}>
      <BrandBar
        action={
          <button
            type="button"
            onClick={onLogin}
            className="rounded-full border border-white/30 bg-white/12 px-5 py-2 font-semibold text-white transition hover:bg-white/18 cursor-pointer"
          >
            Log In
          </button>
        }
      />

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[36px] border border-white/25 bg-[#fff8ec]/88 p-8 text-[#173845] shadow-[0_28px_70px_rgba(0,0,0,0.18)] backdrop-blur-sm md:p-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-[#1d6b63]">
            Learning Support
          </p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
            Welcome to the OLE Nepal Tutor Bot
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#244957]">
            OLE Nepal builds tools that expand access to learning. This tutor
            bot is here to help students practice, review lessons, and get
            guided explanations without replacing their own thinking.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#355866]">
            Sign in to continue your learning conversations, or create an
            account to start using the tutor bot for class support, revision,
            and extra practice.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={onSignup}
              className="inline-flex min-h-14 items-center justify-center rounded-full border-2 border-[#173845] bg-[#f1c84e] px-8 text-lg font-bold text-[#173845] shadow-[0_8px_18px_rgba(23,56,69,0.15)] transition hover:-translate-y-0.5 cursor-pointer"
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={onLogin}
              className="inline-flex min-h-14 items-center justify-center rounded-full border-2 border-[#173845] bg-[#f59c4b] px-8 text-lg font-bold text-[#173845] shadow-[0_8px_18px_rgba(23,56,69,0.15)] transition hover:-translate-y-0.5 cursor-pointer"
            >
              Log In
            </button>
          </div>

          <button
            type="button"
            onClick={onGuest}
            className="mt-4 inline-flex min-h-12 items-center justify-center rounded-full border-2 border-[#173845] bg-white/75 px-7 text-base font-semibold text-[#173845] transition hover:-translate-y-0.5 cursor-pointer"
          >
            Continue as Guest
          </button>
        </div>

        <div className="rounded-[36px] border border-white/22 bg-[#103747]/82 p-8 text-white shadow-[0_28px_70px_rgba(0,0,0,0.18)] backdrop-blur-sm">
          <h2 className="text-2xl font-extrabold">How students should use it</h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-white/84">
            <p>
              Ask for hints, step-by-step explanations, and simpler examples
              when something feels confusing.
            </p>
            <p>
              Use the bot to check understanding after you try the question on
              your own first.
            </p>
            <p>
              Learn from feedback, then go back and complete the work yourself
              in your own words.
            </p>
          </div>
        </div>
      </section>
    </AuthShell>
  );
}

export function LoginPage({
  landingImageSrc,
  notice,
  onSubmit,
  onSignup,
  onForgotPassword,
  onHome,
}: Readonly<{
  landingImageSrc: string;
  notice: string | null;
  onSubmit: (username: string, password: string) => Promise<LoginResult>;
  onSignup: () => void;
  onForgotPassword: () => void;
  onHome: () => void;
}>) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await onSubmit(username.trim(), password);

    if (!result.ok) {
      setError(result.error ?? "Unable to log in right now.");
    }

    setIsSubmitting(false);
  }

  return (
    <AuthCard
      title="Log In"
      subtitle={
        <>
          Don&apos;t have an account yet?{" "}
          <button
            type="button"
            onClick={onSignup}
            className="font-semibold text-[#0f665f] underline underline-offset-2 cursor-pointer"
          >
            Sign up
          </button>
        </>
      }
      landingImageSrc={landingImageSrc}
      onHome={onHome}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {notice ? (
          <div className="rounded-2xl border border-[#9cc3b0] bg-[#ecf8ee] px-4 py-3 text-sm text-[#245842]">
            {notice}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-[#e2a7a2] bg-[#fff1ef] px-4 py-3 text-sm text-[#9c3f35]">
            {error}
          </div>
        ) : null}

        <FormField label="Username">
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            className="w-full rounded-2xl border-2 border-[#7aa3b6] bg-white px-4 py-3 text-[#173845] outline-none transition focus:border-[#173845]"
          />
        </FormField>

        <PasswordField
          label="Password"
          value={password}
          onChange={setPassword}
          show={showPassword}
          onToggle={() => setShowPassword((previous) => !previous)}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex min-h-14 w-full items-center justify-center rounded-2xl border-2 border-[#173845] bg-[#0f8a62] px-6 font-bold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
        >
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>

        <div className="text-center text-sm">
          <button
            type="button"
            onClick={onForgotPassword}
            className="font-medium text-[#173845] underline underline-offset-2 cursor-pointer"
          >
            Forgot your password?
          </button>
        </div>
      </form>
    </AuthCard>
  );
}

export function SignupPage({
  landingImageSrc,
  onSubmit,
  onLogin,
  onHome,
}: Readonly<{
  landingImageSrc: string;
  onSubmit: (payload: SignupPayload) => Promise<LoginResult>;
  onLogin: () => void;
  onHome: () => void;
}>) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [grade, setGrade] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [agreementOpen, setAgreementOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords must match before you can create the account.");
      return;
    }

    if (!agreementAccepted) {
      setError("You need to agree to the student use agreement before continuing.");
      return;
    }

    setIsSubmitting(true);
    const result = await onSubmit({
      name: name.trim(),
      username: username.trim(),
      password,
      grade,
    });

    if (!result.ok) {
      setError(result.error ?? "We could not create the account.");
    }

    setIsSubmitting(false);
  }

  return (
    <>
      <AuthCard
        title="Create Account"
        subtitle={
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={onLogin}
              className="font-semibold text-[#0f665f] underline underline-offset-2 cursor-pointer"
            >
              Log in
            </button>
          </>
        }
        landingImageSrc={landingImageSrc}
        onHome={onHome}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {error ? (
            <div className="rounded-2xl border border-[#e2a7a2] bg-[#fff1ef] px-4 py-3 text-sm text-[#9c3f35]">
              {error}
            </div>
          ) : null}

          <FormField label="Name">
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full rounded-2xl border-2 border-[#7aa3b6] bg-white px-4 py-3 text-[#173845] outline-none transition focus:border-[#173845]"
            />
          </FormField>

          <FormField label="Username">
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              className="w-full rounded-2xl border-2 border-[#7aa3b6] bg-white px-4 py-3 text-[#173845] outline-none transition focus:border-[#173845]"
            />
          </FormField>

          <PasswordField
            label="Password"
            value={password}
            onChange={setPassword}
            show={showPassword}
            onToggle={() => setShowPassword((previous) => !previous)}
          />

          <PasswordField
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showConfirmPassword}
            onToggle={() => setShowConfirmPassword((previous) => !previous)}
          />

          <FormField label="Grade">
            <select
              value={grade}
              onChange={(event) => setGrade(event.target.value)}
              required
              className="w-full rounded-2xl border-2 border-[#7aa3b6] bg-white px-4 py-3 text-[#173845] outline-none transition focus:border-[#173845]"
            >
              <option value="">Select your grade</option>
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map(
                (gradeOption) => (
                  <option key={gradeOption} value={gradeOption}>
                    Grade {gradeOption}
                  </option>
                ),
              )}
            </select>
          </FormField>

          <div className="rounded-2xl border border-[#d6d9d8] bg-white/75 px-4 py-3 text-sm text-[#244957]">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={agreementAccepted}
                onChange={(event) => setAgreementAccepted(event.target.checked)}
                className="mt-1 h-4 w-4 accent-[#0f8a62]"
                required
              />
              <span>
                I have read and agree to the{" "}
                <button
                  type="button"
                  onClick={() => setAgreementOpen(true)}
                  className="font-semibold text-[#0f665f] underline underline-offset-2"
                >
                  student use agreement
                </button>
                .
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex min-h-14 w-full items-center justify-center rounded-2xl border-2 border-[#173845] bg-[#0f8a62] px-6 font-bold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </AuthCard>

      {agreementOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-lg rounded-[28px] border border-white/30 bg-[#fff8ec] p-8 shadow-[0_28px_70px_rgba(0,0,0,0.25)]">
            <h2 className="text-3xl font-black text-[#173845]">
              Student Use Agreement
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-[#244957]">
              <p>
                This tutor bot is a helpful learning tool. Students should use
                it to ask questions, get hints, and understand ideas more
                clearly.
              </p>
              <p>
                It should not be used to do classwork, homework, or tests for
                them. Students should think first, try the work on their own,
                and then use the tutor bot for support.
              </p>
              <p>
                By continuing, the student agrees to use the tutor bot
                responsibly as a guide for learning, not as a replacement for
                their own effort.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setAgreementAccepted(true);
                  setAgreementOpen(false);
                }}
                className="flex-1 rounded-2xl border-2 border-[#173845] bg-[#0f8a62] px-5 py-3 font-bold text-white cursor-pointer transition hover:brightness-130"
              >
                I Agree
              </button>
              <button
                type="button"
                onClick={() => setAgreementOpen(false)}
                className="flex-1 rounded-2xl border-2 border-[#173845] bg-white px-5 py-3 font-bold text-[#173845] cursor-pointer transition hover:bg-white/40"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function ForgotPasswordPage({
  landingImageSrc,
  onSignup,
  onBackToLogin,
  onHome,
}: Readonly<{
  landingImageSrc: string;
  onSignup: () => void;
  onBackToLogin: () => void;
  onHome: () => void;
}>) {
  return (
    <AuthCard
      title="Forgot Password"
      subtitle="Password reset is not available yet, but students can create a fresh account to continue."
      landingImageSrc={landingImageSrc}
      onHome={onHome}
    >
      <div className="space-y-5 text-center">
        <div className="rounded-2xl border border-[#d6d9d8] bg-white/75 px-5 py-4 text-sm leading-7 text-[#244957]">
          If you forgot your password, you can sign up again with the same name
          and grade. You will just need to choose a different username from the
          one you used before.
        </div>

        <button
          type="button"
          onClick={onSignup}
          className="flex min-h-14 w-full items-center justify-center rounded-2xl border-2 border-[#173845] bg-[#0f8a62] px-6 font-bold text-white transition hover:brightness-105"
        >
          Create a New Account
        </button>

        <button
          type="button"
          onClick={onBackToLogin}
          className="font-medium text-[#173845] underline underline-offset-2"
        >
          Back to login
        </button>
      </div>
    </AuthCard>
  );
}
