require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const csrf = require('csrf');
const cookieParser = require('cookie-parser');
const reportRoutes = require('./routes/reportRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Crear un nuevo objeto csrf
const tokens = new csrf();

app.use(
  cors({
    origin: 'http://localhost:4321',
    credentials: true,
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

app.use('/api/reports', reportRoutes);
app.use('/api/stats', statsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
