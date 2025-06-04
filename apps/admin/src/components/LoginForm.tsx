"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError) {
      setError(
        urlError === "invalid"
          ? "Incorrect password. Please try again."
          : urlError
      );
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    if (!password) {
      e.preventDefault();
      setError("Password is required.");
    }
  };

  return (
    <form
      action="/api/auth"
      method="post"
      className="w-full max-w-md space-y-4"
      onSubmit={handleSubmit}
    >
      <div>
        <label htmlFor="password" className="block mb-2">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={e => {
            setPassword(e.target.value);
            setError("");
          }}
        />
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        Sign In
      </button>
    </form>
  );
}