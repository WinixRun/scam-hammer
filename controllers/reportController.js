const validator = require('validator');
const Report = require('../models/reportModel');

const createReport = async (req, res) => {
  try {
    const { telefono, enlace, texto } = req.body;

    if (!validator.isMobilePhone(telefono, 'any')) {
      return res.status(400).json({ message: 'Número de teléfono inválido' });
    }
    if (!validator.isURL(enlace)) {
      return res.status(400).json({ message: 'Enlace inválido' });
    }
    const sanitizedTexto = validator.escape(texto);

    const ipAddress = req.ip || req.connection.remoteAddress;

    const existingReport = await Report.findOne({
      telefono,
      enlace,
      texto: sanitizedTexto,
    });

    if (existingReport) {
      existingReport.cantidad += 1;
      await existingReport.save();
      return res.status(200).json({
        message: 'Reporte existente actualizado',
        report: existingReport,
      });
    }

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
    }).select('-ipAddress');

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReport,
  searchReports,
};
