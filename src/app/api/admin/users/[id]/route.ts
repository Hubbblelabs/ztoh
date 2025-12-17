import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const { name, email, password } = await request.json();

        const updateData: any = { name, email };
        if (password) {
            updateData.password = password;
        }

        if (password) {
            const admin = await Admin.findById(id);
            if (!admin) {
                return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
            }
            admin.name = name;
            admin.email = email;
            admin.password = password;
            await admin.save();
            return NextResponse.json({ message: 'Admin updated successfully', admin });
        } else {
            const admin = await Admin.findByIdAndUpdate(
                id,
                { name, email },
                { new: true }
            ).select('-password');

            if (!admin) {
                return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
            }
            return NextResponse.json({ message: 'Admin updated successfully', admin });
        }

    } catch (error) {
        return NextResponse.json({ error: 'Failed to update admin' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const admin = await Admin.findByIdAndDelete(id);

        if (!admin) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Admin deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting admin:', error);
        return NextResponse.json({ error: error.message || 'Failed to delete admin' }, { status: 500 });
    }
}
