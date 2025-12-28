import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable');
    process.exit(1);
}

const mongoUri: string = MONGODB_URI;

// Staff Schema (duplicate here for script usage)
const StaffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    subjects: [{ type: String }],
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
});

import bcrypt from 'bcryptjs';

async function seedStaff() {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const Staff = mongoose.models.Staff || mongoose.model('Staff', StaffSchema);

        // Check if staff already exists
        const existingStaff = await Staff.findOne({ email: 'staff@ztoh.com' });
        
        if (existingStaff) {
            console.log('Staff member already exists:', existingStaff.email);
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('staff123', salt);

            const staff = await Staff.create({
                name: 'Demo Staff',
                email: 'staff@ztoh.com',
                password: hashedPassword,
                phone: '+1234567890',
                subjects: ['Mathematics', 'Physics'],
                isActive: true,
            });

            console.log('Staff member created successfully!');
            console.log('Email:', staff.email);
            console.log('Password: staff123');
            console.log('');
            console.log('Login at: http://localhost:3000/staff/login');
        }

    } catch (error) {
        console.error('Error seeding staff:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

seedStaff();
