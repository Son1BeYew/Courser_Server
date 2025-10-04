
const express = require('express');
const router = express.Router();
const RecordingController = require('../controllers/RecordingController');

/**
 * @swagger
 * definitions:
 *   Recording:
 *     properties:
 *       recordingId:
 *         type: string
 *       sessionId:
 *         type: string
 *       filePath:
 *         type: string
 *       creationDate:
 *         type: string
 */

/**
 * @swagger
 * tags:
 *   name: Recordings
 *   description: Recording management
 */

/**
 * @swagger
 * /api/recordings/{recordingId}:
 *   get:
 *     description: Get a recording by ID
 *     tags: [Recordings]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: recordingId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *           $ref: '#/definitions/Recording'
 *       401:
 *         description: Unauthorized
 */
router.get('/:recordingId', RecordingController.getRecording);

module.exports = router;
