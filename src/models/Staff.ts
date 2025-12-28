import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IStaff extends Document {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    subjects: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const StaffSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    subjects: [{ type: String }],
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
});

StaffSchema.pre('save', async function (this: IStaff) {
    if (!this.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password as string, salt);
    } catch (error) {
        throw error;
    }
});

StaffSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    try {
        if (!this.password) {
            console.error('Staff password is missing');
            return false;
        }
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        console.error('Error comparing password:', error);
        throw error;
    }
};

const Staff: Model<IStaff> = mongoose.models.Staff || mongoose.model<IStaff>('Staff', StaffSchema);

export default Staff;
