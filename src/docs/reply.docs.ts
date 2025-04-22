/**
 * @swagger
 * tags:
 *   name: Replies
 *   description: Replies to support tickets
 */

/**
 * @swagger
 * /api/v1/replies/{ticketId}/reply:
 *   post:
 *     summary: Add a reply to a ticket
 *     tags: [Replies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the ticket to reply to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reply added successfully
 */


/**
 * @swagger
 * /api/v1/replies/{ticketId}/replies:
 *   get:
 *     summary: Get replies for a specific ticket
 *     tags: [Replies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         schema:
 *           type: string
 *         required: true
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: List of replies
 */
