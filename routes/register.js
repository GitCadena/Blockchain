const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { verifyToken, isAdmin } = require('../middlewares/auth');

router.post('/register', verifyToken, isAdmin, async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ username, password: hashedPassword, role });
  await newUser.save();
  res.status(201).json({ message: 'Usuario registrado' });
});

module.exports = router;
