import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ContactRequest from '@/models/ContactRequest';
import JoinRequest from '@/models/JoinRequest';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');

        if (type === 'contact') {
            const requests = await ContactRequest.find({}).sort({ createdAt: -1 });
            return NextResponse.json(requests);
        } else if (type === 'join') {
            const requests = await JoinRequest.find({}).sort({ createdAt: -1 });
            return NextResponse.json(requests);
        } else {
            // Fetch both if no type specified or invalid type (could be improved)
            const contactRequests = await ContactRequest.find({}).sort({ createdAt: -1 });
            const joinRequests = await JoinRequest.find({}).sort({ createdAt: -1 });
            return NextResponse.json({ contact: contactRequests, join: joinRequests });
        }

    } catch (error) {
        console.error('Error fetching requests:', error);
        return NextResponse.json(
            { error: 'Failed to fetch requests' },
            { status: 500 }
        );
    }
}
