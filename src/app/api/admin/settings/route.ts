import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Settings from '@/models/Settings';

// Helper to ensure DB connection
const connectDB = async () => {
    if (mongoose.connections[0].readyState) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
};

export async function GET() {
    try {
        await connectDB();
        let settings = await Settings.findOne();

        if (!settings) {
            // Create default settings if not exists
            settings = await Settings.create({
                emailSettings: {
                    fromEmail: 'noreply@ztoh.com', // Default
                    adminEmail: 'admin@ztoh.com'   // Default
                }
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Failed to fetch settings:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await connectDB();
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
    } catch (error) {
        console.error('Failed to update settings:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
