import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ISubjectBreakdown {
    subject: string;
    course?: string;
    hours: number;
}

export interface IMonthlyReport extends Document {
    staffId: Types.ObjectId;
    staffName: string;
    staffEmail: string;
    month: number; // 1-12
    year: number;
    totalHours: number;
    subjectBreakdown: ISubjectBreakdown[];
    startDate: Date;
    endDate: Date;
    generatedAt: Date;
    emailSentAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const SubjectBreakdownSchema: Schema = new Schema({
    subject: { type: String, required: true },
    course: { type: String },
    hours: { type: Number, required: true },
}, { _id: false });

const MonthlyReportSchema: Schema = new Schema({
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true, index: true },
    staffName: { type: String, required: true },
    staffEmail: { type: String, required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    totalHours: { type: Number, required: true, default: 0 },
    subjectBreakdown: [SubjectBreakdownSchema],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    generatedAt: { type: Date, required: true, default: Date.now },
    emailSentAt: { type: Date },
}, {
    timestamps: true,
});

// Unique constraint for one report per staff per month
MonthlyReportSchema.index({ staffId: 1, month: 1, year: 1 }, { unique: true });

const MonthlyReport: Model<IMonthlyReport> = mongoose.models.MonthlyReport || mongoose.model<IMonthlyReport>('MonthlyReport', MonthlyReportSchema);

export default MonthlyReport;
