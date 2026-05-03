import { NextResponse } from 'next/server';
import { listCustomers } from '@/lib/mock-data';

// GET /api/admin/customers — list all customers with project summary
export async function GET() {
  try {
    const customers = listCustomers();
    return NextResponse.json({ data: customers });
  } catch (err: unknown) {
    console.error('[GET /api/admin/customers mock]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
