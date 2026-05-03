import { NextRequest, NextResponse } from 'next/server';
import { buildAnalytics } from '@/lib/mock-data';

export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get('locale') === 'en' ? 'en-US' : 'ar-SA';
  try {
    const payload = buildAnalytics(locale);
    return NextResponse.json(payload);
  } catch (err: unknown) {
    console.error('[GET /api/admin/analytics mock]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
