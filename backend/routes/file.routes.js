const express = require("express");
const router = express.Router();

// Prefix all routes with /files
const jwt = require("jsonwebtoken");
const db = require("../models");
const { verifyToken } = require("../auth/auth.middleware");


const File = db.File;
const User = db.User;

/**
 * @swagger
 * /files/{id}/visibility:
 *   put:
 *     summary: Update file visibility
 *     description: Change the privacy setting of a file (owner only)
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: File ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isPrivate:
 *                 type: boolean
 *                 description: New privacy setting
 *     responses:
 *       200:
 *         description: Visibility updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 file:
 *                   $ref: '#/components/schemas/File'
 *       403:
 *         description: Not authorized - only owner can modify
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid token
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/files/:id/visibility", verifyToken, async (req, res) => {
  const fileId = req.params.id;
  const { isPrivate } = req.body;

  try {
    const file = await File.findByPk(fileId);
    if (!file) return res.status(404).json({ message: "File not found" });

    // only owner can change the type
    if (file.owner_id !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    file.is_private = isPrivate;
    await file.save();

    res.json({ message: "Visibility updated", file });
  } catch (err) {
    console.error("Error updating visibility:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /files/{id}:
 *   delete:
 *     summary: Delete a file
 *     description: Delete a file (admin or owner only)
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: File ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Not authorized to delete this file
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid token
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/files/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const userRole = decoded.role;

    const file = await File.findByPk(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    if (userRole !== "admin" && file.owner_id !== userId) {
      return res.status(403).json({ message: "You are not allowed to delete this file." });
    }

    await file.destroy();
    res.json({ message: "File deleted successfully." });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all files from database
 *     description: Retrieve all files stored in the database with user information
 *     tags: [Files]
 *     responses:
 *       200:
 *         description: List of files retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/File'
 *       500:
 *         description: Failed to fetch files
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", async (req, res) => {
  try {
    const files = await File.findAll({
      include: {
        model: User,
        attributes: ["username"],
      },
      order: [["created_at", "DESC"]],
    });

    const response = files.map((file) => ({
      id: file.id,
      name: file.filename,
      cids: [file.cid1, file.cid2, file.cid3],
      owner: file.User?.username || "Unknown", // ✅ Modification here
      is_private: file.is_private, // include privacy status
      timestamp: Math.floor(new Date(file.created_at).getTime() / 1000),
    }));

    res.json(response);
  } catch (err) {
    console.error("❌ Get files error:", err);
    res.status(500).json({ message: "Failed to fetch files" });
  }
});

module.exports = router;
