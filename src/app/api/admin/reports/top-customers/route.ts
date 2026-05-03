import { NextResponse } from 'next/server';
import { getTopCustomersReport } from '@/lib/mock-data';

export async function GET() {
  try {
    return NextResponse.json(getTopCustomersReport());
  } catch (err: unknown) {
    console.error('[GET /api/admin/reports/top-customers mock]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
