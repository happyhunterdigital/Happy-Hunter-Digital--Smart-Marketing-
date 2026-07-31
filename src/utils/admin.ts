import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const ADMIN_EMAILS = [
  'motsumitl@happyhunterdigital.com',
  'happyhunterdigital@gmail.com',
  'motsumitl@gmail.com'
];

export const ADMIN_EMAILS_LIST = ADMIN_EMAILS;

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  return ADMIN_EMAILS.some(a => a.toLowerCase() === normalized);
}

export function isAdminUser(user: { email?: string | null } | null): boolean {
  if (!user?.email) return false;
  return isAdminEmail(user.email);
}
