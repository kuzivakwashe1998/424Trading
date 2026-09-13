// Tiny password gate for the admin dashboard.
// The password comes from VITE_ADMIN_PASSWORD in .env (see .env.example).
// This is intentionally simple — suitable for a single business owner.

const SESSION_KEY = "424_admin_session";

export const adminPasswordConfigured = Boolean(
  import.meta.env.VITE_ADMIN_PASSWORD
);

const DEFAULT_PASSWORD = "424admin";

export function isAdminLoggedIn(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === "yes";
}

export function adminLogin(password: string): boolean {
  const expected = import.meta.env.VITE_ADMIN_PASSWORD || DEFAULT_PASSWORD;
  if (password === expected) {
    sessionStorage.setItem(SESSION_KEY, "yes");
    return true;
  }
  return false;
}

export function adminLogout() {
  sessionStorage.removeItem(SESSION_KEY);
}
