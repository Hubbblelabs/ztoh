import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ContactRequest from '@/models/ContactRequest';
import { Resend } from 'resend';
import { verifyTurnstileToken } from '@/lib/turnstile';
import Settings from '@/models/Settings';
import { checkRateLimit } from '@/lib/rateLimit';
import { generateTrackingId } from '@/lib/utils';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { name, email, message, token } = await req.json();

        // Rate Limiting: 5 requests per hour per IP
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const isAllowed = await checkRateLimit(`contact_${ip}`, 5, 60 * 60 * 1000);

        if (!isAllowed) {
            return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
        }

        // Verify Turnstile Token
        if (token) {
            const isVerified = await verifyTurnstileToken(token);
            if (!isVerified) {
                return NextResponse.json(
                    { error: 'Invalid captcha token' },
                    { status: 400 }
                );
            }
        } else {
            // Optional: Enforce token presence if strict mode is desired.
            // For now, we'll return error if token is missing to enforce usage.
            return NextResponse.json(
                { error: 'Captcha token is required' },
                { status: 400 }
            );
        }

        // Validate input
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required' },
                { status: 400 }
            );
        }

        // Save to database
        const newContactRequest = new ContactRequest({
            name,
            email,
            message,
            trackingId: generateTrackingId('contact'),
        });
        await newContactRequest.save();

        // Send email notification
        // Note: This requires RESEND_API_KEY in .env
        if (process.env.RESEND_API_KEY) {
            try {
                const resend = new Resend(process.env.RESEND_API_KEY);

                const settings = await Settings.findOne();
                const adminEmail = settings?.emailSettings?.adminEmail || process.env.ADMIN_EMAIL;
                const fromEmail = settings?.emailSettings?.fromEmail || process.env.FROM_EMAIL;

                if (adminEmail && fromEmail) {
                    // Send email to Admin
                    await resend.emails.send({
                        from: `Zero To Hero <${fromEmail}>`,
                        to: adminEmail, // Admin email
                        subject: `New Contact Request from ${name}`,
                        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}\nTracking Number: ${newContactRequest.trackingId}`,
                        html: `
                            <h3>New Contact Request</h3>
                            <p><strong>Tracking Number:</strong> ${newContactRequest.trackingId}</p>
                            <p><strong>Name:</strong> ${name}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Message:</strong></p>
                            <p>${message}</p>
                        `,
                    });

                    // Send acknowledgement email to User
                    await resend.emails.send({
                        from: `Zero To Hero <${fromEmail}>`,
                        to: email,
                        subject: `We've received your message!`,
                        text: `Hi ${name},\n\nThank you for contacting Zero to Hero. We have received your message and will get back to you shortly.\n\nBest regards,\nThe Zero to Hero Team`,
                        html: `
                        <h3>Hi ${name},</h3>
                        <p>Thank you for contacting <strong>Zero to Hero</strong>.</p>
                        <p>We have received your message and will get back to you shortly.</p>
                        <p>Your tracking number is: <strong>${newContactRequest.trackingId}</strong></p>
                        <br>
                        <p>Best regards,</p>
                        <p>The Zero to Hero Team</p>
                    `,
                    });
                } else {
                    console.warn("ADMIN_EMAIL or FROM_EMAIL not set in .env. Admin notification skipped.");
                }
            } catch (emailError) {
                console.error("Error sending email:", emailError);
                // We don't fail the request if email fails, but we log it
            }
        } else {
            console.warn("Resend API key not found. Email notification skipped.");
        }

        return NextResponse.json(
            { message: 'Message sent successfully' },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error processing contact request:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
