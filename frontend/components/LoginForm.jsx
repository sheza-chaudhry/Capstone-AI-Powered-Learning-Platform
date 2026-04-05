import { useState } from "react";
import Link from "next/link";


export default function LoginForm({ switchToSignup }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
  
  const handleSubmit = async(e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password) {
        alert("Please fill in all fields");
        return;
    }

    // Login API Call
    try {
        const response = await fetch("http://localhost:8000/auth/login", {
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
            throw new Error(errorData.detail || "Login failed");
        }

        const data = await response.json();

        console.log("User Logged in:", data);

        // TODO: Add error handling for when login fails
        // that is visible to the user
        // onSuccess(); // close modal

    } catch (error) {
        console.error("Login error:", error);
        alert("Failed to Login");
    }


  }

  return (

        <form className="space-y-3 ">
           
           
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

        <button className="w-full bg-blue-600 text-white py-2 rounded"
                onClick = {handleSubmit}
        >
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