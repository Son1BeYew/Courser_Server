const express = require("express");
const router = express.Router();
const lessonController = require("../controllers/LessonController");
const { authMiddleware } = require("../controllers/UserController");

router.post("/", authMiddleware(["admin", "giangvien"]), lessonController.createLesson);

router.get("/", lessonController.getLessons);

router.get("/:id", lessonController.getLessonById);

router.patch("/:id", authMiddleware(["admin", "giangvien"]), lessonController.updateLesson);

router.delete("/:id", authMiddleware(["admin"]), lessonController.deleteLesson);

router.patch("/reorder", authMiddleware(["admin", "giangvien"]), lessonController.reorderLessons);

module.exports = router;
