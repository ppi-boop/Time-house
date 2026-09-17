import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, isValidSessionToken } from "@/lib/admin/auth";

/** True when the caller holds a valid, unexpired admin cookie. */
export async function isSignedIn(): Promise<boolean> {
  const store = await cookies();
  return isValidSessionToken(store.get(SESSION_COOKIE)?.value);
}

/**
 * Guard for admin server actions. The middleware already keeps signed-out
 * visitors away from /admin pages, but an action is its own entry point and has
 * to check for itself.
 */
export async function requireAdmin(): Promise<void> {
  if (!(await isSignedIn())) redirect("/admin/login");
}
