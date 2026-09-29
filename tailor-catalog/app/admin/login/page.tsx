import { loginAction } from "./actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main
      className="min-h-screen flex items-center justify-center px-5"
      style={{ background: "var(--paper)" }}
    >
      <form
        action={loginAction}
        className="w-full max-w-sm rounded-xl border bg-white p-8"
        style={{ borderColor: "var(--thread-light)" }}
      >
        <h1 className="font-display text-2xl mb-1">Admin sign in</h1>
        <p className="text-sm mb-6" style={{ color: "var(--ink-soft)" }}>
          Style-N-Fashion design catalog
        </p>

        {error && (
          <p className="text-sm mb-4 rounded-md px-3 py-2" style={{ background: "#fbeaea", color: "var(--maroon)" }}>
            Incorrect email or password. Try again.
          </p>
        )}

        <label className="block mb-4 text-sm">
          <span className="block mb-1" style={{ color: "var(--ink-soft)" }}>Email</span>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
            style={{ borderColor: "var(--thread)" }}
          />
        </label>

        <label className="block mb-6 text-sm">
          <span className="block mb-1" style={{ color: "var(--ink-soft)" }}>Password</span>
          <input
            type="password"
            name="password"
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
            style={{ borderColor: "var(--thread)" }}
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-md py-2 text-sm font-medium text-white"
          style={{ background: "var(--maroon)" }}
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
