import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends Document {
    name: string;
    email: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, {
    timestamps: true,
});

AdminSchema.pre('save', async function (this: IAdmin) {
    if (!this.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password as string, salt);
    } catch (error) {
        throw error;
    }
});

AdminSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    try {
        if (!this.password) {
            console.error('Admin password is missing');
            return false;
        }
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        console.error('Error comparing password:', error);
        throw error;
    }
};

const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;
