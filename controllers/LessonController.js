const Lesson = require("../models/Lesson");
const mongoose = require("mongoose");
const Course = require("../models/ControllerCourse");
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.createLesson = async (req, res) => {
  try {
    const { course, title, videoUrl, content, order, resources } = req.body;

    if (!course || !isValidId(course)) {
      return res.status(400).json({ message: "course không hợp lệ" });
    }
    if (!title?.trim()) {
      return res.status(400).json({ message: "title là bắt buộc" });
    }
    let finalOrder = order;
    if (finalOrder === undefined || finalOrder === null) {
      const last = await Lesson.findOne({ course })
        .sort({ order: -1 })
        .select("order")
        .lean();
      finalOrder = last ? last.order + 1 : 1;
    }

    const lesson = await Lesson.create({
      course,
      title: title.trim(),
      videoUrl,
      content,
      order: finalOrder,
      resources: Array.isArray(resources) ? resources : undefined,
    });

    return res.status(201).json({ message: "Tạo lesson thành công", lesson });
  } catch (err) {
    console.error("createLesson error:", err);
    return res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

exports.getLessons = async (req, res) => {
  try {
    const {
      course,
      search,
      page = 1,
      limit = 10,
      sortBy = "order",
      sortOrder = "asc",
    } = req.query;

    const filter = {};
    if (course) {
      if (!isValidId(course)) {
        return res.status(400).json({ message: "course không hợp lệ" });
      }
      filter.course = course;
    }
    if (search?.trim()) {
      filter.title = { $regex: search.trim(), $options: "i" };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const [items, total] = await Promise.all([
      Lesson.find(filter).sort(sort).skip(skip).limit(Number(limit)).lean(),
      Lesson.countDocuments(filter),
    ]);

    return res.json({
      items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    console.error("getLessons error:", err);
    return res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

/**
 * GET /api/lessons/:id
 */
exports.getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id))
      return res.status(400).json({ message: "ID không hợp lệ" });

    const lesson = await Lesson.findById(id).lean();
    if (!lesson)
      return res.status(404).json({ message: "Không tìm thấy lesson" });

    return res.json({ lesson });
  } catch (err) {
    console.error("getLessonById error:", err);
    return res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

/**
 * PATCH /api/lessons/:id
 * body: { title?, videoUrl?, content?, order?, resources?[] }
 * - Nếu cập nhật order: chỉ set giá trị mới, KHÔNG tự động dồn lại
 *   (nếu cần dồn lại thứ tự -> dùng endpoint reorder)
 */
exports.updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id))
      return res.status(400).json({ message: "ID không hợp lệ" });

    const payload = {};
    const fields = ["title", "videoUrl", "content", "order", "resources"];
    for (const f of fields) {
      if (req.body[f] !== undefined) {
        payload[f] = f === "title" ? String(req.body[f]).trim() : req.body[f];
      }
    }

    const updated = await Lesson.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updated)
      return res.status(404).json({ message: "Không tìm thấy lesson" });
    return res.json({ message: "Cập nhật thành công", lesson: updated });
  } catch (err) {
    console.error("updateLesson error:", err);
    return res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

/**
 * DELETE /api/lessons/:id
 */
exports.deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id))
      return res.status(400).json({ message: "ID không hợp lệ" });

    const deleted = await Lesson.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy lesson" });

    return res.json({ message: "Xóa thành công" });
  } catch (err) {
    console.error("deleteLesson error:", err);
    return res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

/**
 * PATCH /api/lessons/reorder
 * body: { course, orders: [{ _id, order }, ...] }
 * - Dùng để sắp xếp lại thứ tự trong cùng 1 course
 * - Transaction để đảm bảo tính nhất quán
 */
exports.reorderLessons = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { course, orders } = req.body;

    if (!course || !isValidId(course)) {
      return res.status(400).json({ message: "course không hợp lệ" });
    }
    if (!Array.isArray(orders) || orders.length === 0) {
      return res
        .status(400)
        .json({ message: "orders phải là mảng có phần tử" });
    }

    session.startTransaction();

    // Kiểm tra tất cả _id thuộc cùng course
    const ids = orders.map((o) => o._id).filter(Boolean);
    const found = await Lesson.find({ _id: { $in: ids }, course })
      .session(session)
      .select("_id")
      .lean();
    if (found.length !== ids.length) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Có lesson không thuộc course này hoặc không tồn tại",
      });
    }

    // Cập nhật lần lượt
    for (const item of orders) {
      if (!isValidId(item._id)) {
        await session.abortTransaction();
        return res
          .status(400)
          .json({ message: "Có _id không hợp lệ trong orders" });
      }
      await Lesson.updateOne(
        { _id: item._id },
        { $set: { order: Number(item.order) } },
        { session }
      );
    }

    await session.commitTransaction();
    return res.json({ message: "Reorder thành công" });
  } catch (err) {
    console.error("reorderLessons error:", err);
    await session.abortTransaction();
    return res.status(500).json({ message: "Lỗi server", error: err.message });
  } finally {
    session.endSession();
  }
};
