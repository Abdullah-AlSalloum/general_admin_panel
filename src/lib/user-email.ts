import { findAdminByEmailMock, findCustomerByEmailMock } from '@/lib/mock-data';

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function emailEqualsInsensitive(email: string) {
  return {
    equals: normalizeEmail(email),
    mode: 'insensitive' as const,
  };
}

export async function findCustomerByEmail(email: string) {
  return findCustomerByEmailMock(email);
}

export async function findAdminByEmail(email: string) {
  return findAdminByEmailMock(email);
}