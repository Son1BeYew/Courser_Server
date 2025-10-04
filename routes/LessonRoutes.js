const express = require("express");
const router = express.Router();
const lessonController = require("../controllers/LessonController");

router.post("/", lessonController.createLesson);

router.get("/", lessonController.getLessons);

router.get("/:id", lessonController.getLessonById);

router.patch("/:id", lessonController.updateLesson);

router.delete("/:id", lessonController.deleteLesson);

router.patch("/reorder", lessonController.reorderLessons);

module.exports = router;
