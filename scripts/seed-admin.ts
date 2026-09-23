import 'dotenv/config';
import mongoose from 'mongoose';
import Admin from '../src/models/Admin';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not set. Add it to .env (see .env.example) and try again.');
    process.exit(1);
}

const seedAdmin = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'admin@ztoh.org';
        const password = 'admin123';

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            console.log('Admin user already exists');
        } else {
            const admin = new Admin({
                name: 'System Admin',
                email,
                password, // The model pre-save hook will hash this
                role: 'superadmin',
            });

            await admin.save();
            console.log('Admin user created successfully');
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
};

seedAdmin();
