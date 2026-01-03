import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ITeachingHours extends Document {
    staffId: Types.ObjectId;
    date: Date;
    hours: number;
    subject: string;
    course?: string;
    description?: string;
    groupId?: Types.ObjectId;
    studentIds?: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const TeachingHoursSchema: Schema = new Schema({
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true, index: true },
    date: { type: Date, required: true, index: true },
    hours: { type: Number, required: true, min: 0 },
    subject: { type: String, required: true },
    course: { type: String },
    description: { type: String },
    groupId: { type: Schema.Types.ObjectId, ref: 'Group' },
    studentIds: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
}, {
    timestamps: true,
});

// Compound index for efficient queries
TeachingHoursSchema.index({ staffId: 1, date: 1 });
TeachingHoursSchema.index({ staffId: 1, date: -1 });

const TeachingHours: Model<ITeachingHours> = mongoose.models.TeachingHours || mongoose.model<ITeachingHours>('TeachingHours', TeachingHoursSchema);

export default TeachingHours;
