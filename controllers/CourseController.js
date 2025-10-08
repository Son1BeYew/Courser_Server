const Course = require("../models/Course");
const cloudinary = require("../config/cloudinary");

const bufferToDataURI = (buffer, mimetype) =>
  `data:${mimetype};base64,${buffer.toString("base64")}`;

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("category", "name")
      .populate("instructor", "name avatar") // NEW: populate instructor
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
      .populate("instructor", "name avatar") // NEW: populate instructor
      .sort({ students: -1, rating: -1 })
      .limit(5);

    res.json(courses);
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};

exports.getCoursesByCategory = async (req, res) => {
  try {
    const courses = await Course.find({ category: req.params.id })
      .populate("category", "name")
      .populate("instructor", "name avatar"); // NEW: populate instructor
    res.json(courses);
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("category", "name")
      .populate("instructor", "name avatar") // NEW: populate instructor
      .populate("lessons"); // NEW: populate lessons
    if (!course)
      return res.status(404).json({ msg: "Không tìm thấy khóa học" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { title, description, price, category, instructor } = req.body;
    if (!title || !price || !category) {
      return res.status(400).json({ msg: "Vui lòng nhập đầy đủ thông tin" });
    }

    let thumbnail;
    if (req.file) {
      const dataURI = bufferToDataURI(req.file.buffer, req.file.mimetype);
      const uploaded = await cloudinary.uploader.upload(dataURI, {
        folder: "lms/courses/images",
        resource_type: "image",
      });
      thumbnail = uploaded.secure_url;
    }

    const courseData = {
      title,
      description,
      price,
      category,
      thumbnail,
      image: thumbnail, // Keep backward compatibility
    };
    
    // Only add instructor if provided (for live classes)
    if (instructor) {
      courseData.instructor = instructor;
    }

    const newCourse = new Course(courseData);

    await newCourse.save();
    
    // Populate before sending response
    await newCourse.populate("category", "name");
    if (newCourse.instructor) {
      await newCourse.populate("instructor", "name avatar");
    }
    
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
