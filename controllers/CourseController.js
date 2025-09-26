const Course = require("../models/Course");

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("category", "name")
      .sort({ students: -1, rating: -1 });

    res.json(courses);
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};

exports.getTopCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("category", "name")
      .sort({ students: -1, rating: -1 })
      .limit(5);

    res.json(courses);
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};

exports.getCoursesByCategory = async (req, res) => {
  try {
    const courses = await Course.find({ category: req.params.id }).populate(
      "category",
      "name"
    );
    res.json(courses);
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "category",
      "name"
    );
    if (!course)
      return res.status(404).json({ msg: "Không tìm thấy khóa học" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { title, price, category } = req.body;
    if (!title || !price || !category) {
      return res.status(400).json({ msg: "Vui lòng nhập đầy đủ thông tin" });
    }

    const newCourse = new Course({
      title,
      price,
      category,
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!course)
      return res.status(404).json({ msg: "Không tìm thấy khóa học" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course)
      return res.status(404).json({ msg: "Không tìm thấy khóa học" });
    res.json({ msg: "Xóa khóa học thành công" });
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};
