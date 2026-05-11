import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api`;

type LoginResponse = {
  token: string;
  userId: string;
  username: string;
};

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return Boolean(username.trim() && password.trim()) && !isSubmitting;
  }, [username, password, isSubmitting]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    const normalizedUsername = username.trim();
    const normalizedPassword = password.trim();

    if (!normalizedUsername || !normalizedPassword) {
      setError("Please enter your username and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: normalizedUsername,
          password: normalizedPassword,
        }),
      });

      const data = (await response.json()) as
        | LoginResponse
        | { error?: string };

      if (!response.ok) {
        const backendError = "error" in data ? data.error : undefined;
        setError(backendError ?? "Login failed. Please try again.");
        return;
      }

      if (!("token" in data) || !("userId" in data) || !("username" in data)) {
        setError("Login response is missing required fields.");
        return;
      }

      const storage = rememberMe ? window.localStorage : window.sessionStorage;
      const alternateStorage = rememberMe
        ? window.sessionStorage
        : window.localStorage;

      alternateStorage.removeItem("token");
      alternateStorage.removeItem("userId");
      alternateStorage.removeItem("username");

      storage.setItem("token", data.token);
      storage.setItem("userId", data.userId);
      storage.setItem("username", data.username);

      window.setTimeout(() => {
        navigate("/home");
      }, 500);
    } catch {
      setError("Problem connecting to the server. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border border-stone-300 bg-stone-100 p-6 shadow-sm">
        <h1 className="m-0 text-3xl font-bold leading-tight">Log In</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-stone-800">
              Username
            </span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-lg border border-stone-400 bg-transparent px-3 py-2.5 text-sm outline-none ring-black transition focus:border-black focus:ring-1"
              placeholder="Enter your username"
              autoComplete="username"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-stone-800">
              Password
            </span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-stone-400 bg-transparent px-3 py-2.5 pr-16 text-sm outline-none ring-black transition focus:border-black focus:ring-1"
                autoComplete="current-password"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-600 hover:text-black"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <label className="mt-1 inline-flex items-center gap-2 text-sm text-stone-700">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="h-4 w-4 rounded border-stone-400"
            />
            Remember me
          </label>

          {error && (
            <p className="m-0 mb-3 text-sm font-medium text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-px hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mb-0 mt-6 text-center text-sm text-stone-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-black hover:underline"
          >
            Register
          </Link>
        </p>
      </section>
    </main>
  );
}
