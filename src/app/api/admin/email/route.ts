import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import mongoose from 'mongoose';
import Settings from '@/models/Settings';

const resend = new Resend(process.env.RESEND_API_KEY);

const connectDB = async () => {
    if (mongoose.connections[0].readyState) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { to, subject, html, attachments } = body;

        if (!to || !subject || !html) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        await connectDB();
        const settings = await Settings.findOne();
        const fromEmail = settings?.emailSettings?.fromEmail || process.env.FROM_EMAIL || 'Zero To Hero <onboarding@resend.dev>';

        // Prepare attachments for Resend
        const emailAttachments = attachments?.map((att: any) => {
            const base64Content = att.content.split(',')[1] || att.content;
            return {
                filename: att.name,
                content: Buffer.from(base64Content, 'base64'),
            };
        }) || [];

        const data = await resend.emails.send({
            from: fromEmail,
            to: to,
            subject: subject,
            html: html,
            attachments: emailAttachments
        });

        if (data.error) {
            return NextResponse.json({ error: data.error }, { status: 400 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: 'Failed to send email' },
            { status: 500 }
        );
    }
}
