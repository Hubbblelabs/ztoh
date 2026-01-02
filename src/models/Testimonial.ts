import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITestimonial extends Document {
    name: string;
    role: string;
    content: string;
    rating: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TestimonialSchema: Schema = new Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
});

const Testimonial: Model<ITestimonial> = mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

export default Testimonial;
