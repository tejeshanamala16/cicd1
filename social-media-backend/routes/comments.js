const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get comments for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const conn = await pool.getConnection();

    const [comments] = await conn.query(`
      SELECT 
        c.id, c.post_id, c.user_id, c.content, c.created_at,
        u.username, u.full_name, u.profile_picture
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `, [postId]);

    conn.release();

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Create comment
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { post_id, content } = req.body;

    if (!post_id || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const conn = await pool.getConnection();

    const [result] = await conn.query(
      'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
      [post_id, req.userId, content]
    );

    conn.release();

    res.status(201).json({ 
      message: 'Comment created successfully',
      commentId: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Update comment
router.put('/:commentId', authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const conn = await pool.getConnection();

    // Check ownership
    const [comments] = await conn.query(
      'SELECT user_id FROM comments WHERE id = ?',
      [commentId]
    );

    if (comments.length === 0 || comments[0].user_id !== req.userId) {
      conn.release();
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await conn.query(
      'UPDATE comments SET content = ? WHERE id = ?',
      [content, commentId]
    );

    conn.release();

    res.json({ message: 'Comment updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// Delete comment
router.delete('/:commentId', authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;
    const conn = await pool.getConnection();

    // Check ownership
    const [comments] = await conn.query(
      'SELECT user_id FROM comments WHERE id = ?',
      [commentId]
    );

    if (comments.length === 0 || comments[0].user_id !== req.userId) {
      conn.release();
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await conn.query('DELETE FROM comments WHERE id = ?', [commentId]);

    conn.release();

    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;
