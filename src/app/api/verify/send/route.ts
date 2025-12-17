import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import VerificationCode from '@/models/VerificationCode';
import { Resend } from 'resend';
import { checkRateLimit } from '@/lib/rateLimit';
import Settings from '@/models/Settings';

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const email = body.email?.trim();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Rate Limiting: 3 requests per 10 minutes per IP
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const isAllowed = await checkRateLimit(`verify_send_${ip}`, 3, 10 * 60 * 1000);

        if (!isAllowed) {
            return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
        }

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save to DB
        await VerificationCode.create({
            email,
            code,
            expiresAt,
        });

        // Send Email
        if (process.env.RESEND_API_KEY) {
            const resend = new Resend(process.env.RESEND_API_KEY);
            const settings = await Settings.findOne();
            const fromEmail = settings?.emailSettings?.fromEmail || process.env.FROM_EMAIL || 'onboarding@resend.dev';

            await resend.emails.send({
                from: `Zero To Hero <${fromEmail}>`,
                to: email,
                subject: 'Your Verification Code',
                html: `
                    <p>Your verification code is: <strong>${code}</strong></p>
                    <p>This code will expire in 10 minutes.</p>
                `,
            });
        } else {
            console.warn("RESEND_API_KEY not set. Code:", code);
            // For development, you might want to return the code or log it
        }

        return NextResponse.json({ message: 'Verification code sent' });

    } catch (error) {
        console.error('Error sending verification code:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
