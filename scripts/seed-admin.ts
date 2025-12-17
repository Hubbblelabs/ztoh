import mongoose from 'mongoose';
import Admin from '../src/models/Admin';


const seedAdmin = async () => {
    try {
        // Clean URI if needed (remove empty appName)
        const uri = 'mongodb+srv://kavinnandha:kavin4343@cluster0.ipg5jxa.mongodb.net/ztoh?appName=Cluster0';

        await mongoose.connect(uri);
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
                role: 'superadmin'
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
