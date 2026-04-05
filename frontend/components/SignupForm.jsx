import { useState } from "react";

export default function SignupForm({ onSuccess, switchToLogin }) {
//   const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password || !confirmPassword) {
        alert("Please fill in all fields");
        return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Signup API Call
    try {
        const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
        });

        if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        throw new Error(errorData.detail || "Signup failed");
        }

        const data = await response.json();

        console.log("User created:", data);

        // TODO: Add error handling for when signup fails
        // that is visible to the user
        onSuccess(); // close modal

    } catch (error) {
        console.error("Signup error:", error);
        alert("Failed to create account");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Username"
        className="w-full border p-2 rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full border p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        className="w-full border p-2 rounded"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        Create Account
      </button>

      <p className="text-sm text-center">
        Already have an account?{" "}
        <button
          type="button"
          onClick={switchToLogin}
          className="text-blue-600 underline"
        >
          Log in
        </button>
      </p>
    </form>
  );
}