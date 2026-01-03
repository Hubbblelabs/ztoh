import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IGroup extends Document {
    name: string;
    staffId: Types.ObjectId;
    studentIds: Types.ObjectId[];
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const GroupSchema: Schema = new Schema({
    name: { type: String, required: true },
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    studentIds: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    description: { type: String },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
});

const Group: Model<IGroup> = mongoose.models.Group || mongoose.model<IGroup>('Group', GroupSchema);

export default Group;
