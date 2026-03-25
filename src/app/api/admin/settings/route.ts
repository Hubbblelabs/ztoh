import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Settings from '@/models/Settings';

export async function GET() {
    try {
        await verifyAuth();
        await dbConnect();
        let settings = await Settings.findOne();

        if (!settings) {
            // Create default settings if not exists
            settings = await Settings.create({
                emailSettings: {
                    fromEmail: 'noreply@ztoh.com', // Default
                    adminEmail: 'admin@ztoh.com', // Default
                },
            });
        }

        return NextResponse.json(settings);
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.error('Failed to fetch settings:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await verifyAuth();
        await dbConnect();
        const body = await req.json();
        const { emailSettings } = body;

        let settings = await Settings.findOne();

        if (!settings) {
            settings = new Settings({ emailSettings });
        } else {
            settings.emailSettings = { ...settings.emailSettings, ...emailSettings };
        }

        await settings.save();

        return NextResponse.json(settings);
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.error('Failed to update settings:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
