import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import dbConnect from '@/lib/db';
import Feedback, { type IFeedback } from '@/models/Feedback';
import Settings from '@/models/Settings';
import { checkRateLimit } from '@/lib/rateLimit';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { escapeHtml, generateTrackingId } from '@/lib/utils';
import {
    FEEDBACK_TOPIC_LABELS,
    FEEDBACK_TYPE_LABELS,
    validateFeedbackInput,
    type FeedbackInput,
} from '@/lib/feedback';

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => null);

        // Rate Limiting: 5 submissions per hour per IP
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const isAllowed = await checkRateLimit(`feedback_${ip}`, 5, 60 * 60 * 1000);

        if (!isAllowed) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 },
            );
        }

        const result = validateFeedbackInput(body);
        if (!result.success) {
            return NextResponse.json(
                { error: Object.values(result.errors)[0], errors: result.errors },
                { status: 400 },
            );
        }

        // Verify Turnstile Token
        const token = body?.token;
        if (typeof token !== 'string' || !token) {
            return NextResponse.json({ error: 'Captcha token is required' }, { status: 400 });
        }
        if (!(await verifyTurnstileToken(token))) {
            return NextResponse.json({ error: 'Invalid captcha token' }, { status: 400 });
        }

        await dbConnect();
        const feedback = await createFeedback(result.data);
        await notifyAdmin(feedback);

        return NextResponse.json(
            { message: 'Feedback submitted successfully', trackingId: feedback.trackingId },
            { status: 201 },
        );
    } catch (error) {
        console.error('Error submitting feedback:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Tracking IDs are the date plus 4 random digits, so a same-day collision with the unique
// index is possible. Retry with a fresh ID rather than failing the submission.
async function createFeedback(data: FeedbackInput) {
    for (let attempt = 1; ; attempt++) {
        try {
            return await Feedback.create({ ...data, trackingId: generateTrackingId('feedback') });
        } catch (error) {
            const isDuplicateKey = (error as { code?: number }).code === 11000;
            if (!isDuplicateKey || attempt >= 3) throw error;
        }
    }
}

// Emails the admin about new feedback. Failures are logged, never surfaced to the submitter.
async function notifyAdmin(feedback: IFeedback) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('Resend API key not found. Feedback notification skipped.');
        return;
    }

    try {
        const settings = await Settings.findOne();
        const adminEmail = settings?.emailSettings?.adminEmail || process.env.ADMIN_EMAIL;
        const fromEmail = settings?.emailSettings?.fromEmail || process.env.FROM_EMAIL;

        if (!adminEmail || !fromEmail) {
            console.warn('ADMIN_EMAIL or FROM_EMAIL not set. Feedback notification skipped.');
            return;
        }

        const typeLabel = FEEDBACK_TYPE_LABELS[feedback.type];
        const details: [string, string][] = [
            ['Tracking Number', feedback.trackingId],
            ['Type', typeLabel],
            ['Topic', FEEDBACK_TOPIC_LABELS[feedback.topic]],
            ['Rating', feedback.rating ? `${feedback.rating}/5` : 'Not rated'],
            ['Name', feedback.name],
            ['Email', feedback.email],
            ['Subject', feedback.subject],
        ];
        const adminUrl = process.env.NEXTAUTH_URL
            ? `${process.env.NEXTAUTH_URL.replace(/\/$/, '')}/admin/feedback`
            : null;

        const resend = new Resend(process.env.RESEND_API_KEY);
        const { error } = await resend.emails.send({
            from: `Zero To Hero <${fromEmail}>`,
            to: adminEmail,
            replyTo: feedback.email,
            subject: `New feedback (${typeLabel}): ${feedback.subject}`,
            text: [
                ...details.map(([label, value]) => `${label}: ${value}`),
                '',
                'Message:',
                feedback.message,
                ...(adminUrl ? ['', `Review it in the admin panel: ${adminUrl}`] : []),
            ].join('\n'),
            html: `
                <h3>New Feedback Received</h3>
                ${details
                    .map(
                        ([label, value]) =>
                            `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`,
                    )
                    .join('')}
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap;">${escapeHtml(feedback.message)}</p>
                ${adminUrl ? `<p><a href="${adminUrl}">Review it in the admin panel</a></p>` : ''}
            `,
        });

        if (error) {
            console.error('Error sending feedback notification:', error);
        }
    } catch (error) {
        console.error('Error sending feedback notification:', error);
    }
}
