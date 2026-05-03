import { NextResponse } from 'next/server';
import { getContactsStatusReport } from '@/lib/mock-data';

export async function GET() {
  try {
    return NextResponse.json(getContactsStatusReport());
  } catch (err: unknown) {
    console.error('[GET /api/admin/reports/contacts-status mock]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
