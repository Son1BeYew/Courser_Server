const express = require("express");
const router = express.Router();
const courseController = require("../controllers/CourseController");

router.get("/", courseController.getCourses);
router.get("/:id", courseController.getCourseById);
router.post("/", courseController.createCourse);
router.put("/:id", courseController.updateCourse);
router.delete("/:id", courseController.deleteCourse);
router.get("/category/:id", courseController.getCoursesByCategory);
module.exports = router;
