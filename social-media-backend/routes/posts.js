const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all posts (feed)
router.get('/', async (req, res) => {
  try {
    const conn = await pool.getConnection();

    const [posts] = await conn.query(`
      SELECT 
        p.id, p.user_id, p.content, p.image_url, p.likes_count, p.created_at,
        u.username, u.full_name, u.profile_picture
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 50
    `);

    conn.release();

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get user's posts
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const conn = await pool.getConnection();

    const [posts] = await conn.query(`
      SELECT 
        p.id, p.user_id, p.content, p.image_url, p.likes_count, p.created_at,
        u.username, u.full_name, u.profile_picture
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `, [userId]);

    conn.release();

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
});

// Create post
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { content, image_url } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const conn = await pool.getConnection();

    const [result] = await conn.query(
      'INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)',
      [req.userId, content, image_url]
    );

    conn.release();

    res.status(201).json({ 
      message: 'Post created successfully',
      postId: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Update post
router.put('/:postId', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, image_url } = req.body;

    const conn = await pool.getConnection();

    // Check ownership
    const [posts] = await conn.query('SELECT user_id FROM posts WHERE id = ?', [postId]);

    if (posts.length === 0 || posts[0].user_id !== req.userId) {
      conn.release();
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await conn.query(
      'UPDATE posts SET content = ?, image_url = ? WHERE id = ?',
      [content, image_url, postId]
    );

    conn.release();

    res.json({ message: 'Post updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete post
router.delete('/:postId', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const conn = await pool.getConnection();

    // Check ownership
    const [posts] = await conn.query('SELECT user_id FROM posts WHERE id = ?', [postId]);

    if (posts.length === 0 || posts[0].user_id !== req.userId) {
      conn.release();
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await conn.query('DELETE FROM posts WHERE id = ?', [postId]);

    conn.release();

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Like post
router.post('/:postId/like', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const conn = await pool.getConnection();

    const [existing] = await conn.query(
      'SELECT id FROM likes WHERE post_id = ? AND user_id = ?',
      [postId, req.userId]
    );

    if (existing.length === 0) {
      await conn.query(
        'INSERT INTO likes (post_id, user_id) VALUES (?, ?)',
        [postId, req.userId]
      );

      await conn.query(
        'UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?',
        [postId]
      );
    }

    conn.release();

    res.json({ message: 'Post liked successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// Unlike post
router.post('/:postId/unlike', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const conn = await pool.getConnection();

    await conn.query(
      'DELETE FROM likes WHERE post_id = ? AND user_id = ?',
      [postId, req.userId]
    );

    await conn.query(
      'UPDATE posts SET likes_count = likes_count - 1 WHERE id = ? AND likes_count > 0',
      [postId]
    );

    conn.release();

    res.json({ message: 'Post unliked successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to unlike post' });
  }
});

module.exports = router;
