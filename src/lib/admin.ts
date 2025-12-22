/**
 * Helper functions for admin authentication and authorization
 */

/**
 * Checks if the given email is in the admin whitelist
 * @param email - User email to check
 * @returns true if the email is an admin, false otherwise
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) {
    return false;
  }

  const adminEmails = process.env.ADMIN_EMAILS || "";
  
  // Split by comma and trim whitespace
  const adminList = adminEmails
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0);

  return adminList.includes(email.toLowerCase());
}

