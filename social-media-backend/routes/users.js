const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const conn = await pool.getConnection();

    const [users] = await conn.query(
      'SELECT id, username, email, full_name, bio, profile_picture, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      conn.release();
      return res.status(404).json({ error: 'User not found' });
    }

    // Get follower/following counts
    const [followers] = await conn.query('SELECT COUNT(*) as count FROM followers WHERE following_id = ?', [userId]);
    const [following] = await conn.query('SELECT COUNT(*) as count FROM followers WHERE follower_id = ?', [userId]);

    conn.release();

    res.json({
      ...users[0],
      followers_count: followers[0].count,
      following_count: following[0].count
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { full_name, bio, profile_picture } = req.body;

    if (req.userId !== parseInt(userId)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const conn = await pool.getConnection();

    await conn.query(
      'UPDATE users SET full_name = ?, bio = ?, profile_picture = ? WHERE id = ?',
      [full_name, bio, profile_picture, userId]
    );

    conn.release();

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Follow user
router.post('/:userId/follow', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.userId === parseInt(userId)) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    const conn = await pool.getConnection();

    await conn.query(
      'INSERT IGNORE INTO followers (follower_id, following_id) VALUES (?, ?)',
      [req.userId, userId]
    );

    conn.release();

    res.json({ message: 'Followed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to follow user' });
  }
});

// Unfollow user
router.post('/:userId/unfollow', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    const conn = await pool.getConnection();

    await conn.query(
      'DELETE FROM followers WHERE follower_id = ? AND following_id = ?',
      [req.userId, userId]
    );

    conn.release();

    res.json({ message: 'Unfollowed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
});

module.exports = router;
