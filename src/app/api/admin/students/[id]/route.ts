
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import Group from '@/models/Group';
import TeachingHours from '@/models/TeachingHours';

// PUT - Update a student
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const { name, email, password, phone, isActive } = await request.json();

        await dbConnect();

        const student = await Student.findById(id);
        if (!student) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== student.email) {
            const existingStudent = await Student.findOne({ email });
            if (existingStudent) {
                return NextResponse.json(
                    { error: 'Email already in use' },
                    { status: 400 }
                );
            }
            student.email = email;
        }

        if (name) student.name = name;
        if (phone !== undefined) student.phone = phone;
        if (isActive !== undefined) student.isActive = isActive;

        // Only update password if provided and non-empty
        if (password && password.trim() !== '') {
            student.password = password; // The pre-save hook will hash this
        }

        await student.save();

        return NextResponse.json({ success: true, student });
    } catch (error) {
        console.error('Error updating student:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE - Delete a student
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        await dbConnect();

        const deletedStudent = await Student.findByIdAndDelete(id);

        if (!deletedStudent) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        // Remove student from any groups they are part of
        await Group.updateMany(
            { studentIds: id },
            { $pull: { studentIds: id } }
        );

        // Remove student from any teaching hours logs
        await TeachingHours.updateMany(
            { studentIds: id },
            { $pull: { studentIds: id } }
        );

        return NextResponse.json({ success: true, message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
