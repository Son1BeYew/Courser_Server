const express = require('express');
const router = express.Router();
const SessionController = require('../controllers/SessionController');

/**
 * @swagger
 * definitions:
 *   Session:
 *     properties:
 *       courseId:
 *         type: string
 *   SessionResponse:
 *     properties:
 *       sessionId:
 *         type: string
 *       courseId:
 *         type: string
 *       startTime:
 *         type: string
 *       endTime:
 *         type: string
 *       participants:
 *         type: array
 *         items:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Session management
 */

/**
 * @swagger
 * /api/sessions:
 *   post:
 *     description: Create a new session
 *     tags: [Sessions]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: courseId
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Session'
 *     responses:
 *       201:
 *         description: Session created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', SessionController.createSession);

/**
 * @swagger
 * /api/sessions/{sessionId}:
 *   get:
 *     description: Get a session by ID
 *     tags: [Sessions]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: sessionId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *           $ref: '#/definitions/SessionResponse'
 *       401:
 *         description: Unauthorized
 */
router.get('/:sessionId', SessionController.getSession);

/**
 * @swagger
 * /api/sessions/{sessionId}:
 *   delete:
 *     description: Delete a session by ID
 *     tags: [Sessions]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: sessionId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: Session deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/:sessionId', SessionController.deleteSession);

/**
 * @swagger
 * /api/sessions/{sessionId}/join:
 *   post:
 *     description: Join a session
 *     tags: [Sessions]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: sessionId
 *         in: path
 *         required: true
 *         type: string
 *       - name: userId
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
router.post('/:sessionId/join', SessionController.joinSession);

/**
 * @swagger
 * /api/sessions/{sessionId}/record/start:
 *   post:
 *     description: Start recording a session
 *     tags: [Sessions]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: sessionId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: Recording started successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/:sessionId/record/start', SessionController.startRecording);

/**
 * @swagger
 * /api/sessions/{sessionId}/record/stop:
 *   post:
 *     description: Stop recording a session
 *     tags: [Sessions]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: sessionId
 *         in: path
 *         required: true
 *         type: string
 *       - name: recordingId
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             recordingId:
 *               type: string
 *     responses:
 *       200:
 *         description: Recording stopped successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/:sessionId/record/stop', SessionController.stopRecording);

/**
 * @swagger
 * /api/sessions/{sessionId}/token:
 *   post:
 *     description: Get a token for a video call session
 *     tags: [Sessions]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: sessionId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A token for the video call session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */
router.post('/:sessionId/token', SessionController.getToken);

module.exports = router;
