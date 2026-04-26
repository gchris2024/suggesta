import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

type RegisterResponse = {
  message: string;
  userId: string;
  email: string;
  username: string;
};

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      Boolean(
        email.trim() &&
        username.trim() &&
        password.trim() &&
        confirmPassword.trim(),
      ) && !isSubmitting
    );
  }, [email, username, password, confirmPassword, isSubmitting]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    if (
      !normalizedEmail ||
      !normalizedUsername ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError("Please fill out all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          username: normalizedUsername,
          password,
        }),
      });

      const data = (await response.json()) as
        | RegisterResponse
        | { error?: string };

      if (!response.ok) {
        const backendError = "error" in data ? data.error : undefined;
        setError(backendError ?? "Registration failed. Please try again.");
        return;
      }

      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");

      window.setTimeout(() => {
        navigate("/login");
      }, 900);
    } catch {
      setError("Could not connect to the backend.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-12">
      <div className="grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <section className="mx-auto w-full max-w-md rounded-2xl border border-stone-300 bg-stone-100 p-6 shadow-sm">
          <h1 className="m-0 text-3xl font-bold leading-tight">Register</h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-stone-800">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-stone-400 bg-transparent px-3 py-2.5 text-sm outline-none ring-black transition placeholder:text-stone-400 focus:border-black focus:ring-1"
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-stone-800">
                User name
              </span>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-lg border border-stone-400 bg-transparent px-3 py-2.5 text-sm outline-none ring-black transition placeholder:text-stone-400 focus:border-black focus:ring-1"
                placeholder="Choose a username"
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
                  className="w-full rounded-lg border border-stone-400 bg-transparent px-3 py-2.5 pr-16 text-sm outline-none ring-black transition placeholder:text-stone-400 focus:border-black focus:ring-1"
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  required
                  minLength={6}
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

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-stone-800">
                Confirm Password
              </span>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-lg border border-stone-400 bg-transparent px-3 py-2.5 pr-16 text-sm outline-none ring-black transition placeholder:text-stone-400 focus:border-black focus:ring-1"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-600 hover:text-black"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {error && (
              <p className="m-0 text-sm font-medium text-red-700">{error}</p>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-px hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="mb-0 mt-5 text-center text-sm text-stone-500">
            Already have an Account ?{" "}
            <Link
              to="/login"
              className="font-semibold text-black hover:underline"
            >
              Login
            </Link>
          </p>
        </section>

        <section className="hidden lg:block" aria-hidden="true">
          <div className="h-72 w-full rounded-2xl bg-gray-300 xl:h-[30rem]" />
        </section>
      </div>
    </main>
  );
}
