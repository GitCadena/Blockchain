const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model'); // Asegúrate de tener el modelo de usuario correctamente configurado
const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
  const { username, password, isAdmin } = req.body; // Asegúrate de recibir isAdmin

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ 
    username, 
    password: hashedPassword, 
    role: isAdmin ? 'admin' : 'user' // Asigna el rol según isAdmin
  });

  try {
    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el registro', error });
  }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, 'YOUR_SECRET_KEY'); // Usa una clave secreta adecuada
    res.json({ token, role: user.role }); // Devuelve el token y el rol
  } catch (error) {
    res.status(500).json({ message: 'Error en el inicio de sesión', error });
  }
});

// Exportar las rutas
module.exports = router;
