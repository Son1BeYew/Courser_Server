const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    thumbnail: { type: String }, // Changed from 'image' to match frontend
    image: { type: String }, // Keep for backward compatibility
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Optional: only for live classes
    rating: { type: Number, default: 0 },
    students: { type: Number, default: 0 }, // Will map to studentsEnrolled in frontend
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }], // NEW: lessons array
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Course", CourseSchema);
