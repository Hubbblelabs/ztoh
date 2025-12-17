import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import VerificationCode from '@/models/VerificationCode';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const email = body.email?.trim();
        const code = body.code?.trim();

        if (!email || !code) {
            return NextResponse.json({ error: 'Email and code are required' }, { status: 400 });
        }

        // Rate Limiting: 5 attempts per 10 minutes per IP
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const isAllowed = await checkRateLimit(`verify_check_${ip}`, 5, 10 * 60 * 1000);

        if (!isAllowed) {
            return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 });
        }

        // Find code
        const record = await VerificationCode.findOne({ email, code });

        if (!record) {
            return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
        }

        // Check expiration (double check, though Mongo TTL should handle it)
        if (new Date() > record.expiresAt) {
            return NextResponse.json({ error: 'Code expired' }, { status: 400 });
        }

        // Success - Delete the code to prevent reuse
        await VerificationCode.deleteOne({ _id: record._id });

        return NextResponse.json({ message: 'Email verified successfully' });

    } catch (error) {
        console.error('Error verifying code:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
