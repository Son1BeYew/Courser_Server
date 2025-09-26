const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  rating: { type: Number, default: 0 },
  students: { type: Number, default: 0 },
});

module.exports = mongoose.model("Course", CourseSchema);
