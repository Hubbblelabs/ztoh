import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IStudent extends Document {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    enrolledIn?: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const StudentSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    enrolledIn: [{ type: String }],
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
});

StudentSchema.pre('save', async function (this: IStudent) {
    if (!this.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password as string, salt);
    } catch (error) {
        throw error;
    }
});

StudentSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    try {
        if (!this.password) {
            console.error('Student password is missing');
            return false;
        }
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        console.error('Error comparing password:', error);
        throw error;
    }
};

const Student: Model<IStudent> = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
