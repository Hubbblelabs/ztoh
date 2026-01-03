
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Import models (using require to avoid issue with ts-node needing .ts extension vs compilation)
// But since we use tsx, we can import if we point to the right place.
// Let's fallback to simplified requires or dynamic imports if needed, but tsx should handle relative imports fine if paths are mapped.
// However, tsconfig paths might not be respected by tsx without extra config.
// Safest is to define the models here or use relative paths without aliases.

// Standard connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

// Minimal Schema Definitions for the script to avoid import issues
const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
});
const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);

const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    staffId: { type: mongoose.Schema.Types.ObjectId, required: true },
    studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
});
const Group = mongoose.models.Group || mongoose.model('Group', GroupSchema);

const TeachingHoursSchema = new mongoose.Schema({
    staffId: { type: mongoose.Schema.Types.ObjectId, required: true },
    date: { type: Date, required: true },
    hours: { type: Number, required: true },
    subject: { type: String, required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
});
const TeachingHours = mongoose.models.TeachingHours || mongoose.model('TeachingHours', TeachingHoursSchema);

async function main() {
    await mongoose.connect(MONGODB_URI as string);
    console.log('Connected to MongoDB');

    try {
        const testSuffix = Math.floor(Math.random() * 10000);
        const staffId = new mongoose.Types.ObjectId(); // Mock staff ID

        // 1. Create Student
        console.log('1. Creating Student...');
        const student = await Student.create({
            name: `Test Student ${testSuffix}`,
            email: `student${testSuffix}@test.com`,
            password: 'hashedpassword123',
        });
        console.log(`   Student created: ${student._id} (${student.email})`);

        // 2. Create Group
        console.log('2. Creating Group...');
        const group = await Group.create({
            name: `Test Group ${testSuffix}`,
            staffId: staffId,
            studentIds: [student._id],
        });
        console.log(`   Group created: ${group._id}`);

        // 3. Log Hours for Group
        console.log('3. Logging Hours for Group...');
        const hoursGroup = await TeachingHours.create({
            staffId: staffId,
            date: new Date(),
            hours: 2,
            subject: 'Math',
            groupId: group._id,
        });
        console.log(`   Logged 2 hours for group: ${hoursGroup._id}`);

        // 4. Log Hours for Student directly
        console.log('4. Logging Hours for Student directly...');
        const hoursStudent = await TeachingHours.create({
            staffId: staffId,
            date: new Date(),
            hours: 1.5,
            subject: 'Physics',
            studentIds: [student._id],
        });
        console.log(`   Logged 1.5 hours for student: ${hoursStudent._id}`);

        // 5. Verify Dashboard Data (Query)
        console.log('5. Verifying Student Dashboard Query...');
        const studentGroups = await Group.find({ studentIds: student._id }).distinct('_id');

        const logs = await TeachingHours.find({
            $or: [
                { studentIds: student._id },
                { groupId: { $in: studentGroups } }
            ]
        });

        const totalHours = logs.reduce((acc: number, curr: any) => acc + curr.hours, 0);
        console.log(`   Found ${logs.length} logs. Total Hours: ${totalHours}`);

        if (totalHours === 3.5) {
            console.log('   SUCCESS: Total hours match expected (2 + 1.5 = 3.5)');
        } else {
            console.error(`   FAILURE: Expected 3.5 hours, got ${totalHours}`);
            process.exit(1);
        }

    } catch (error) {
        console.error('Error in verification:', error);
        process.exit(1);
    } finally {
        // Cleanup if needed, or leave for manual inspection
        // await mongoose.connection.close(); // Keep open if we want to see logs but usually we close
        await mongoose.disconnect();
    }
}

main();
