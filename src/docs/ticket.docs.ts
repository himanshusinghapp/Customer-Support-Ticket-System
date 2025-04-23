/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Ticket management
 */

/**
 * @swagger
 * /api/v1/tickets:
 *   post:
 *     summary: Create a new support ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ticket created successfully
 */


/**
 * @swagger
 * /api/v1/tickets:
 *   get:
 *     summary: Get all tickets for the logged-in user
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user tickets
 */


/**
 * @swagger
 * /api/v1/tickets/recent:
 *   get:
 *     summary: Get recently created tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of recent tickets
 */

/**
 * @swagger
 * /api/v1/tickets/{id}:
 *   get:
 *     summary: Get ticket details by ID
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Ticket data
 */
