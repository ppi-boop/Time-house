import type { Metadata } from "next";

/**
 * Applies to the login screen as well as the panel, so nothing under /admin is
 * ever indexed. The session check lives one level down, in (panel)/layout.tsx —
 * putting it here would send the login page into a redirect loop with itself.
 */
export const metadata: Metadata = {
  title: { default: "Shop admin", template: "%s · Shop admin" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
