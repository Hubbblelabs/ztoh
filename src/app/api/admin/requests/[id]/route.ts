import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ContactRequest from '@/models/ContactRequest';
import JoinRequest from '@/models/JoinRequest';

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const params = await props.params;
        const { id } = params;
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');

        if (!type) {
            return NextResponse.json({ error: 'Type is required' }, { status: 400 });
        }

        if (type === 'contact') {
            await ContactRequest.findByIdAndDelete(id);
        } else if (type === 'join') {
            await JoinRequest.findByIdAndDelete(id);
        } else {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        return NextResponse.json({ message: 'Request deleted successfully' });
    } catch (error) {
        console.error('Error deleting request:', error);
        return NextResponse.json({ error: 'Failed to delete request' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const params = await props.params;
        const { id } = params;
        const body = await request.json();
        const { type, ...updates } = body;

        if (!type) {
            return NextResponse.json({ error: 'Type is required' }, { status: 400 });
        }

        let updatedRequest;
        if (type === 'contact') {
            updatedRequest = await ContactRequest.findByIdAndUpdate(id, updates, { new: true });
        } else if (type === 'join') {
            updatedRequest = await JoinRequest.findByIdAndUpdate(id, updates, { new: true });
        } else {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        return NextResponse.json(updatedRequest);
    } catch (error) {
        console.error('Error updating request:', error);
        return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
    }
}
