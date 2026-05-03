import { NextRequest, NextResponse } from 'next/server';
import {
  deleteStudy,
  getStudyById,
  sectorValues,
  studyStatusValues,
  type Sector,
  type StudyStatus,
  updateStudy,
} from '@/lib/mock-data';

// GET /api/admin/studies/[id] — fetch a single study
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const study = getStudyById(id);
    if (!study) {
      return NextResponse.json({ error: 'Study not found' }, { status: 404 });
    }
    return NextResponse.json(study);
  } catch (e: unknown) {
    console.error('[GET /api/admin/studies/:id mock]', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/admin/studies/[id] — update a study
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const {
    title,
    sector,
    price,
    oldPrice,
    status,
    shortDescription,
    coverImage,
    fileUrl,
    deliverables,
    templateFoundingExpenses,
    templateOperatingExpenses,
    templateSales,
  } = body;

  if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0 || title.length > 200)) {
    return NextResponse.json({ error: 'title must be a non-empty string up to 200 characters' }, { status: 400 });
  }

  if (price !== undefined && (typeof price !== 'number' || !Number.isFinite(price) || price < 0)) {
    return NextResponse.json({ error: 'price must be a non-negative number' }, { status: 400 });
  }

  if (price !== undefined && price > 999999.99) {
    return NextResponse.json({ error: 'price cannot exceed 999,999.99' }, { status: 400 });
  }

  if (sector && !sectorValues.includes(sector as Sector)) {
    return NextResponse.json({ error: 'Invalid sector' }, { status: 400 });
  }

  if (status !== undefined && !studyStatusValues.includes(status as StudyStatus)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  if (shortDescription != null && String(shortDescription).length > 1500) {
    return NextResponse.json({ error: 'الوصف المختصر لا يمكن أن يتجاوز 1500 حرف' }, { status: 400 });
  }

  for (const [field, val] of Object.entries({ coverImage, fileUrl })) {
    if (val != null) {
      try {
        const u = new URL(val as string);
        if (u.protocol !== 'https:') throw new Error();
      } catch {
        return NextResponse.json({ error: `${field} must be a valid https URL` }, { status: 400 });
      }
    }
  }

  if (deliverables !== undefined) {
    if (
      !Array.isArray(deliverables) ||
      deliverables.length > 20 ||
      deliverables.some((d) => typeof d !== 'string' || d.trim().length === 0 || d.length > 300)
    ) {
      return NextResponse.json({ error: 'deliverables must be an array of up to 20 non-empty strings' }, { status: 400 });
    }
  }

  type FeRow = { name: string; amount: number };
  type OeRow = { month: number; name: string; amount: number };
  type SaleRow = { month: number; amount: number };

  if (templateFoundingExpenses !== undefined) {
    if (
      !Array.isArray(templateFoundingExpenses) ||
      templateFoundingExpenses.length > 200 ||
      (templateFoundingExpenses as unknown[]).some((r) => {
        if (typeof r !== 'object' || r === null) return true;
        const row = r as Record<string, unknown>;
        return (
          typeof row.name !== 'string' ||
          row.name.trim().length === 0 ||
          row.name.length > 255 ||
          typeof row.amount !== 'number' ||
          Number.isNaN(row.amount as number) ||
          (row.amount as number) < 0
        );
      })
    ) {
      return NextResponse.json({ error: 'Invalid templateFoundingExpenses' }, { status: 400 });
    }
  }

  if (templateOperatingExpenses !== undefined) {
    if (
      !Array.isArray(templateOperatingExpenses) ||
      templateOperatingExpenses.length > 500 ||
      (templateOperatingExpenses as unknown[]).some((r) => {
        if (typeof r !== 'object' || r === null) return true;
        const row = r as Record<string, unknown>;
        return (
          typeof row.month !== 'number' ||
          !Number.isInteger(row.month) ||
          (row.month as number) < 1 ||
          (row.month as number) > 120 ||
          typeof row.name !== 'string' ||
          row.name.trim().length === 0 ||
          row.name.length > 255 ||
          typeof row.amount !== 'number' ||
          Number.isNaN(row.amount as number) ||
          (row.amount as number) < 0
        );
      })
    ) {
      return NextResponse.json({ error: 'Invalid templateOperatingExpenses' }, { status: 400 });
    }
  }

  if (templateSales !== undefined) {
    if (
      !Array.isArray(templateSales) ||
      templateSales.length > 120 ||
      (templateSales as unknown[]).some((r) => {
        if (typeof r !== 'object' || r === null) return true;
        const row = r as Record<string, unknown>;
        return (
          typeof row.month !== 'number' ||
          !Number.isInteger(row.month) ||
          (row.month as number) < 1 ||
          (row.month as number) > 120 ||
          typeof row.amount !== 'number' ||
          Number.isNaN(row.amount as number) ||
          (row.amount as number) < 0
        );
      })
    ) {
      return NextResponse.json({ error: 'Invalid templateSales' }, { status: 400 });
    }
  }

  try {
    const study = updateStudy(id, {
      ...(title !== undefined && { title: title as string }),
      ...(sector !== undefined && { sector: sector as Sector }),
      ...(price !== undefined && { price: price as number }),
      ...(oldPrice !== undefined && { oldPrice: oldPrice as number | null }),
      ...(status !== undefined && { status: status as StudyStatus }),
      ...(shortDescription !== undefined && { shortDescription: shortDescription as string | null }),
      ...(coverImage !== undefined && { coverImage: coverImage as string | null }),
      ...(fileUrl !== undefined && { fileUrl: fileUrl as string | null }),
      ...(deliverables !== undefined && { deliverables: (deliverables as string[]).map((d) => d.trim()) }),
      ...(Array.isArray(templateFoundingExpenses) && {
        templateFoundingExpenses: (templateFoundingExpenses as FeRow[]).map((r) => ({
          name: r.name.trim(),
          amount: r.amount,
        })),
      }),
      ...(Array.isArray(templateOperatingExpenses) && {
        templateOperatingExpenses: (templateOperatingExpenses as OeRow[]).map((r) => ({
          month: r.month,
          name: r.name.trim(),
          amount: r.amount,
        })),
      }),
      ...(Array.isArray(templateSales) && {
        templateSales: (templateSales as SaleRow[]).map((r) => ({ month: r.month, amount: r.amount })),
      }),
    });

    if (!study) {
      return NextResponse.json({ error: 'Study not found' }, { status: 404 });
    }

    return NextResponse.json(study);
  } catch (e: unknown) {
    console.error('[PATCH /api/admin/studies/:id mock]', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/studies/[id] — delete a study
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const deleted = deleteStudy(id);
    if (!deleted) return NextResponse.json({ error: 'Study not found' }, { status: 404 });
  } catch (e: unknown) {
    console.error('[DELETE /api/admin/studies/:id mock]', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
