import { useState } from "react";

export default function LoginForm({ switchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form className="space-y-3">
      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full border p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="w-full bg-blue-600 text-white py-2 rounded">
        Sign In
      </button>

      <p className="text-sm text-center">
        Don't have an account?{" "}
        <button type="button" onClick={switchToSignup} className="text-blue-600 underline">
          Sign up
        </button>
      </p>
    </form>
  );
}