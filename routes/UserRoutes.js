const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

/**
 * @swagger
 * definitions:
 *   User:
 *     required:
 *       - fullname
 *       - dob
 *       - email
 *       - phone
 *       - password
 *     properties:
 *       fullname:
 *         type: string
 *         description: Full name of the user
 *         example: Nguyen Van A
 *       dob:
 *         type: string
 *         format: date
 *         description: Date of birth (YYYY-MM-DD)
 *         example: 2000-01-15
 *       email:
 *         type: string
 *         format: email
 *         description: User email address
 *         example: user@example.com
 *       phone:
 *         type: string
 *         description: Phone number
 *         example: 0912345678
 *       password:
 *         type: string
 *         format: password
 *         description: User password
 *         example: password123
 *       role:
 *         type: string
 *         enum: [admin, giangvien, hocsinh]
 *         default: hocsinh
 *         description: User role
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     description: Register a new user
 *     tags: [Users]
 *     parameters:
 *       - name: user
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post("/register", userController.register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     description: Login a user
 *     tags: [Users]
 *     parameters:
 *       - name: user
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.post("/login", userController.login);

module.exports = router;
