import { NextRequest, NextResponse } from 'next/server';
import { changeAdminPassword, getAdminPublicProfile, updateAdminProfileName } from '@/lib/mock-data';
import { rateLimit } from '@/lib/rateLimit';

export async function GET() {
  try {
    const user = getAdminPublicProfile();
    return NextResponse.json({ ok: true, user });
  } catch (err: unknown) {
    console.error('[GET /api/admin/profile mock]', err);
    return NextResponse.json({ ok: false, error: 'حدث خطأ' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  if (!rateLimit(`admin-profile:${ip}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: 'طلبات كثيرة، حاول لاحقاً' }, { status: 429 });
  }

  try {
    const { name, currentPassword, newPassword } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json({ ok: false, error: 'الاسم مطلوب' }, { status: 400 });
    }
    if (name.trim().length < 2) {
      return NextResponse.json({ ok: false, error: 'الاسم يجب أن يكون حرفين على الأقل' }, { status: 400 });
    }
    if (name.trim().length > 100) {
      return NextResponse.json({ ok: false, error: 'الاسم لا يتجاوز 100 حرف' }, { status: 400 });
    }

    updateAdminProfileName(name.trim());

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ ok: false, error: 'أدخل كلمة المرور الحالية' }, { status: 400 });
      }
      if (newPassword.length > 128) {
        return NextResponse.json({ ok: false, error: 'كلمة المرور طويلة جداً' }, { status: 400 });
      }
      if (newPassword.length < 8) {
        return NextResponse.json({ ok: false, error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' }, { status: 400 });
      }
      const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
      if (!passwordPolicy.test(newPassword)) {
        return NextResponse.json(
          {
            ok: false,
            error: 'يجب أن تحتوي كلمة المرور على حرف كبير وصغير ورقم ورمز خاص على الأقل',
          },
          { status: 400 }
        );
      }

      const result = changeAdminPassword(currentPassword, newPassword);
      if (!result.ok && result.reason === 'INVALID_CURRENT') {
        return NextResponse.json({ ok: false, error: 'كلمة المرور الحالية غير صحيحة' }, { status: 400 });
      }
      if (!result.ok && result.reason === 'SAME_PASSWORD') {
        return NextResponse.json({ ok: false, error: 'كلمة المرور الجديدة يجب أن تختلف عن الحالية' }, { status: 400 });
      }
    }

    return NextResponse.json({ ok: true, passwordChanged: !!newPassword });
  } catch (err: unknown) {
    console.error('[PATCH /api/admin/profile mock]', err);
    return NextResponse.json({ ok: false, error: 'حدث خطأ أثناء التحديث' }, { status: 500 });
  }
}
