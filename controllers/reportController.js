const validator = require('validator');
const moment = require('moment');
const Report = require('../models/reportModel');

const createReport = async (req, res) => {
  try {
    const { telefono, enlace, texto } = req.body;

    // Validar y sanitizar
    if (!validator.isMobilePhone(telefono, 'any')) {
      return res.status(400).json({ message: 'Número de teléfono inválido' });
    }
    if (!validator.isURL(enlace)) {
      return res.status(400).json({ message: 'Enlace inválido' });
    }
    const sanitizedTexto = validator.escape(texto);

    // Capturar la IP del cliente
    const ipAddress =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Verificar si el usuario ha hecho un reporte en los últimos 5 minutos
    const recentReport = await Report.findOne({
      ipAddress,
      createdAt: { $gte: moment().subtract(5, 'minutes').toDate() },
    });

    if (recentReport) {
      console.log(`Reporte reciente encontrado: ${recentReport.createdAt}`);
      return res
        .status(429)
        .json({
          message: 'Debe esperar 5 minutos antes de enviar otro reporte.',
        });
    }

    // Comprobar si ya existe un reporte idéntico
    const existingReport = await Report.findOne({
      telefono,
      enlace,
      texto: sanitizedTexto,
    });

    if (existingReport) {
      existingReport.cantidad += 1;
      existingReport.lastReportedAt = Date.now();
      await existingReport.save();
      return res.status(200).json({
        message: 'Reporte existente actualizado',
        report: existingReport,
      });
    }

    // Crear un nuevo reporte si no existe uno idéntico
    const newReport = new Report({
      telefono,
      enlace,
      texto: sanitizedTexto,
      cantidad: 1,
      ipAddress,
    });
    await newReport.save();
    res
      .status(201)
      .json({ message: 'Reporte enviado exitosamente', report: newReport });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchReports = async (req, res) => {
  try {
    const { query } = req.query;
    const sanitizedQuery = validator.escape(query);

    const results = await Report.find({
      $or: [
        { telefono: { $regex: sanitizedQuery, $options: 'i' } },
        { enlace: { $regex: sanitizedQuery, $options: 'i' } },
        { texto: { $regex: sanitizedQuery, $options: 'i' } },
      ],
    }).select('-ipAddress'); // Excluir el campo ipAddress

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReport,
  searchReports,
};
