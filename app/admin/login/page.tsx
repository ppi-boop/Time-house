import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";
import {
  SESSION_COOKIE,
  createSessionToken,
  isAdminConfigured,
  verifyPassword,
} from "@/lib/admin/auth";
import { isSignedIn } from "@/lib/admin/session";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  if (await isSignedIn()) redirect(next || "/admin");

  async function signIn(formData: FormData) {
    "use server";

    const password = String(formData.get("password") ?? "");
    const destination = String(formData.get("next") ?? "") || "/admin";
    const hash = process.env.ADMIN_PASSWORD_HASH;

    if (!hash || !(await verifyPassword(password, hash))) {
      redirect(`/admin/login?error=1${destination ? `&next=${encodeURIComponent(destination)}` : ""}`);
    }

    const { value, maxAge } = createSessionToken();
    (await cookies()).set(SESSION_COOKIE, value, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge,
    });
    // Only ever send people to a path on this site, never to an absolute URL
    // someone slipped into the query string.
    redirect(destination.startsWith("/") ? destination : "/admin");
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-surface-2 px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="mt-8 rounded-[var(--radius-lg)] border border-line bg-surface p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <h1 className="font-serif text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>
            Shop admin
          </h1>
          <p className="mt-2 text-sm text-fg-muted">
            Sign in to edit the catalogue, the shop details and the pages.
          </p>

          {!isAdminConfigured && (
            <p className="mt-6 rounded-[var(--radius-sm)] border border-line bg-surface p-4 text-xs leading-relaxed text-fg-muted">
              No password is set yet. Run{" "}
              <code className="text-accent-ink">npm run admin:password -- &apos;your password&apos;</code>{" "}
              and restart the server.
            </p>
          )}

          <form action={signIn} className="mt-7 space-y-4">
            <input type="hidden" name="next" value={next ?? ""} />
            <div>
              <label htmlFor="password" className="text-xs tracking-[0.14em] text-fg-muted uppercase">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                autoFocus
                className="mt-2 h-12 w-full rounded-full border border-line bg-surface px-5 text-sm transition-colors focus-visible:border-accent focus-visible:outline-none"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-[var(--radius-sm)] border border-line-strong bg-surface px-3 py-2 text-xs text-fg"
              >
                That password is not right.
              </p>
            )}

            <Button type="submit" size="lg" className="w-full">
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
