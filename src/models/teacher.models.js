import mongoose, { Schema } from "mongoose";

const teacherSchema = new Schema(
    {
        uniqueId: {
            type: String,
            required: true,
            trim: true, // Optional: to remove whitespace
        },
        attendance: {
            // Corrected spelling from 'attendace' to 'attendance'
            type: Number,
            required: true, // Optional: if attendance is always required
        },
        grades: {
            type: Number,
            required: true, // Optional: if grades are always required
        },
        streak: {
            type: Number,
            required: true, // Optional: if streak is always required
        },
        behaviour: {
            type: Number,
            required: true, // Optional: if behaviour is always required
        },
        test: {
            type: Number,
            required: true, // Optional: if test scores are always required
        },
        attention: {
            type: Number,
            required: true, // Optional: if attention scores are always required
        },
    },
    { timestamps: true }
); // Optional: adds createdAt and updatedAt fields

export const teacher = mongoose.model("teacher", teacherSchema); // Capitalized model name for convention
