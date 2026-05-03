import { NextRequest, NextResponse } from 'next/server';
import { contactStatusValues, type ContactStatus, deleteContact, listContacts, updateContactStatus } from '@/lib/mock-data';

// GET /api/admin/contacts — list all contacts
export async function GET() {
  try {
    const contacts = listContacts({ customOnly: false });
    return NextResponse.json({ data: contacts });
  } catch (err: unknown) {
    console.error('[GET /api/admin/contacts mock]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/admin/contacts/[id] — update status
export async function PATCH(req: NextRequest) {
  let id: unknown, status: unknown;
  try {
    ({ id, status } = await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!id || typeof id !== 'string' || !contactStatusValues.includes(status as ContactStatus)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const contact = updateContactStatus(id, status as ContactStatus, { customOnly: false });
  if (!contact) return NextResponse.json({ error: 'Contact not found' }, { status: 404 });

  return NextResponse.json(contact);
}

// DELETE /api/admin/contacts — delete a contact by id
export async function DELETE(req: NextRequest) {
  let id: unknown;
  try {
    ({ id } = await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  if (!id || typeof id !== 'string') return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const deleted = deleteContact(id, { customOnly: false });
  if (!deleted) return NextResponse.json({ error: 'Contact not found' }, { status: 404 });

  return new NextResponse(null, { status: 204 });
}
