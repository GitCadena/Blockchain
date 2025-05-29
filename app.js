const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser'); // Asegúrate de incluir este módulo
const User = require(path.join(__dirname, 'models', 'user.model'));
const Block = require('./models/block.model');
const logRoutes = require('./routes/logRoutes');
const authRoutes = require('./routes/authRoutes');
const blockchainRoutes = require('./routes/blockchainRoutes');
const registerRoutes = require('./routes/register');
const { sendLogToBlockchain } = require('./services/blockchainService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(bodyParser.json());
app.use(session({
  secret: 'tu_secreto_aqui',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Cambia a true si usas HTTPS
}));

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/miBaseDeDatos')
  .then(() => {
    console.log('Conectado a la base de datos MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas
app.use('/auth', authRoutes);
app.use('/blockchain', blockchainRoutes);
app.use('/register', registerRoutes);
app.use('/logs', logRoutes);

// Simulación de blockchain en memoria
let blockchain = [];

// Función para generar el hash del bloque
function generateBlockHash(previousHash, log) {
  const hash = crypto.createHash('sha256');
  hash.update(previousHash + JSON.stringify(log));
  return hash.digest('hex');
}

// Función para crear un nuevo bloque y guardarlo en MongoDB
async function createNewBlock(log) {
  const previousHash = blockchain.length === 0 ? '0' : blockchain[blockchain.length - 1].hash;
  const newBlock = new Block({
    log: log,
    previousHash: previousHash,
    hash: generateBlockHash(previousHash, log),
  });

  // Enviar el log a la blockchain externa
  try {
    await sendLogToBlockchain(log);
    console.log('Log enviado a la blockchain');
  } catch (error) {
    console.error('Error al enviar el log a la blockchain:', error);
  }

  // Guardar el bloque en MongoDB
  try {
    const savedBlock = await newBlock.save();
    console.log('Bloque guardado en MongoDB:', savedBlock);
  } catch (err) {
    console.error('Error al guardar el bloque en MongoDB:', err);
  }

  // Agregar el bloque a la cadena en memoria
  blockchain.push(newBlock);
}

// Ruta para recibir interacciones y registrar logs
app.post('/logs', (req, res) => {
  const log = req.body;

  // Guardar el log en un archivo
  fs.appendFile('user_logs.json', JSON.stringify(log) + '\n', (err) => {
    if (err) {
      return res.status(500).send('Error guardando el log');
    }

    // Crear un nuevo bloque en la cadena de bloques y guardarlo en MongoDB
    createNewBlock(log);

    res.send('Interacción registrada y bloque creado');
  });
});

// Ruta para visualizar la cadena de bloques
app.get('/blockchain', (req, res) => {
  res.json(blockchain);
});

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Servir el archivo index.html como página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
