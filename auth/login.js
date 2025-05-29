const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Simulación de base de datos
const users = [
  {
    username: 'usuarioEjemplo',
    password: '$2a$10$g5tXSRetY9/PKSNhHX1H1.4IcNmISYE0d9ivGNnjIJqm8q.34ZX5G',
    role: 'admin',
  }
];

// Ruta para iniciar sesión
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  
  if (!user) {
    return res.status(401).json({ message: 'Usuario no encontrado' });
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al verificar la contraseña' });
    }
    
    if (!result) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ username: user.username, role: user.role }, 'tu_clave_secreta', { expiresIn: '1h' });
    res.status(200).json({ token, role: user.role });
  });
});

module.exports = router;
