import { NextRequest, NextResponse } from 'next/server';
import { createStudy, listStudies, sectorValues, studyStatusValues, type Sector, type StudyStatus } from '@/lib/mock-data';

// GET /api/admin/studies — list all studies
export async function GET() {
  try {
    return NextResponse.json({ data: listStudies() });
  } catch (err: unknown) {
    console.error('[GET /api/admin/studies mock]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/studies — create a study
export async function POST(req: NextRequest) {
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

  if (!title || !sector || price === undefined) {
    return NextResponse.json({ error: 'title, sector and price are required' }, { status: 400 });
  }

  if (typeof title !== 'string' || title.trim().length === 0 || title.length > 200) {
    return NextResponse.json({ error: 'title must be between 1 and 200 characters' }, { status: 400 });
  }

  if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: 'price must be a non-negative number' }, { status: 400 });
  }

  if (price > 999999.99) {
    return NextResponse.json({ error: 'price cannot exceed 999,999.99' }, { status: 400 });
  }

  if (!sectorValues.includes(sector as Sector)) {
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
    const study = createStudy({
      title: title as string,
      sector: sector as Sector,
      price: price as number,
      oldPrice: (oldPrice as number | null | undefined) ?? null,
      status: (status as StudyStatus) ?? 'DRAFT',
      shortDescription: (shortDescription as string | null | undefined) ?? null,
      coverImage: (coverImage as string | null | undefined) ?? null,
      fileUrl: (fileUrl as string | null | undefined) ?? null,
      deliverables: Array.isArray(deliverables)
        ? (deliverables as string[]).map((d) => (d as string).trim())
        : [],
      templateFoundingExpenses: Array.isArray(templateFoundingExpenses)
        ? (templateFoundingExpenses as FeRow[]).map((r) => ({ name: r.name.trim(), amount: r.amount }))
        : [],
      templateOperatingExpenses: Array.isArray(templateOperatingExpenses)
        ? (templateOperatingExpenses as OeRow[]).map((r) => ({ month: r.month, name: r.name.trim(), amount: r.amount }))
        : [],
      templateSales: Array.isArray(templateSales)
        ? (templateSales as SaleRow[]).map((r) => ({ month: r.month, amount: r.amount }))
        : [],
    });

    return NextResponse.json(study, { status: 201 });
  } catch (err: unknown) {
    console.error('[POST /api/admin/studies mock]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
