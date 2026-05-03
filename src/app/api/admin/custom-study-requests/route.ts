import { NextRequest, NextResponse } from 'next/server';
import { contactStatusValues, type ContactStatus, deleteContact, listContacts, updateContactStatus } from '@/lib/mock-data';

export async function GET() {
	try {
		const contacts = listContacts({ customOnly: true });
		return NextResponse.json({ data: contacts });
	} catch (err: unknown) {
		console.error('[GET /api/admin/custom-study-requests mock]', err);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

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

	const contact = updateContactStatus(id, status as ContactStatus, { customOnly: true });
	if (!contact) return NextResponse.json({ error: 'Contact not found' }, { status: 404 });

	return NextResponse.json(contact);
}

export async function DELETE(req: NextRequest) {
	let id: unknown;
	try {
		({ id } = await req.json());
	} catch {
		return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
	}

	if (!id || typeof id !== 'string') {
		return NextResponse.json({ error: 'Missing id' }, { status: 400 });
	}

	const deleted = deleteContact(id, { customOnly: true });
	if (!deleted) return NextResponse.json({ error: 'Contact not found' }, { status: 404 });

	return new NextResponse(null, { status: 204 });
}