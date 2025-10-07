const express = require("express");
const router = express.Router();
const categoryCtrl = require("../controllers/CategoryController");
const { authMiddleware } = require("../controllers/UserController");

/**
 * @swagger
 * definitions:
 *   Category:
 *     properties:
 *       name:
 *         type: string
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     description: Get all categories
 *     tags: [Categories]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
router.get("/", categoryCtrl.getAll);

router.get("/:id", categoryCtrl.getById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     description: Create a new category
 *     tags: [Categories]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: category
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Category'
 *     responses:
 *       201:
 *         description: Category created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", authMiddleware(["admin"]), categoryCtrl.create);

router.put("/:id", authMiddleware(["admin"]), categoryCtrl.update);

router.delete("/:id", authMiddleware(["admin"]), categoryCtrl.delete);

module.exports = router;
