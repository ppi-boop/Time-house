import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/admin/auth";
import { isSignedIn } from "@/lib/admin/session";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // The login page has its own layout-free route, so everything under here is
  // behind the session. The middleware checks the cookie's shape; this checks
  // its signature.
  if (!(await isSignedIn())) redirect("/admin/login");

  async function signOut() {
    "use server";
    (await cookies()).delete(SESSION_COOKIE);
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-surface-2">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur-sm">
        <div className="container-luxe flex h-16 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/admin"
              className="font-serif text-lg whitespace-nowrap"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Shop admin
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs tracking-[0.12em] text-fg-muted uppercase transition-colors hover:text-fg"
            >
              View site
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="text-xs tracking-[0.12em] text-fg-muted uppercase transition-colors hover:text-fg"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="container-luxe grid min-w-0 gap-6 py-6 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-10 md:py-8 xl:grid-cols-[14rem_minmax(0,1fr)] xl:gap-14 xl:py-10">
        <AdminNav />
        {/* Capped, because a form field 900px wide is harder to read, not easier. */}
        <main className="min-w-0 max-w-4xl">{children}</main>
      </div>
    </div>
  );
}
