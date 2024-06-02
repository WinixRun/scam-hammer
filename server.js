const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const csrf = require('csrf');
const cookieParser = require('cookie-parser');
const reportRoutes = require('./routes/reportRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Crear un nuevo objeto csrf
const tokens = new csrf();

// Configuración de CORS para permitir cookies
app.use(
  cors({
    origin: 'http://localhost:4321', // Reemplaza con la URL de tu frontend
    credentials: true, // Permitir el envío de cookies
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

// Middleware para generar y validar tokens CSRF
app.use((req, res, next) => {
  const token = req.cookies['XSRF-TOKEN'];
  if (
    req.method === 'GET' ||
    req.method === 'HEAD' ||
    req.method === 'OPTIONS'
  ) {
    if (!token) {
      const newToken = tokens.create(process.env.CSRF_SECRET);
      res.cookie('XSRF-TOKEN', newToken, { httpOnly: false, secure: false });
    }
    return next();
  }

  if (!tokens.verify(process.env.CSRF_SECRET, token)) {
    return res.status(403).json({ message: 'Token CSRF inválido' });
  }

  next();
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

// Montar las rutas en el prefijo /api
app.use('/api', reportRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
