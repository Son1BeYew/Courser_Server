const express = require("express");
const router = express.Router();
const courseController = require("../controllers/CourseController");
const { authMiddleware } = require("../controllers/UserController");

/**
 * @swagger
 * definitions:
 *   Course:
 *     properties:
 *       title:
 *         type: string
 *       price:
 *         type: number
 *       category:
 *         type: string
 */

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     description: Get all courses
 *     tags: [Courses]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
router.get("/", courseController.getCourses);

/**
 * @swagger
 * /api/courses/category/{id}:
 *   get:
 *     description: Get courses by category
 *     tags: [Courses]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
router.get("/category/:id", courseController.getCoursesByCategory);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     description: Get a course by ID
 *     tags: [Courses]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", courseController.getCourseById);

/**
 * @swagger
 * /api/courses:
 *   post:
 *     description: Create a new course
 *     tags: [Courses]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: course
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Course'
 *     responses:
 *       201:
 *         description: Course created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", authMiddleware(["admin", "giangvien"]), courseController.createCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     description: Update a course by ID
 *     tags: [Courses]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *       - name: course
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Course'
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", authMiddleware(["admin", "giangvien"]), courseController.updateCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     description: Delete a course by ID
 *     tags: [Courses]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", authMiddleware(["admin"]), courseController.deleteCourse);

module.exports = router;
