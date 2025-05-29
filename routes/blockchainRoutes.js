const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/auth');
const Block = require('../models/block.model');

// Ver blockchain (solo admin)
router.get('/blockchain', verifyToken, isAdmin, async (req, res) => {
  const blocks = await Block.find();
  res.json(blocks);
});

module.exports = router;
