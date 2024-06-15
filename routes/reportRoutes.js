const express = require('express');
const {
  createReport,
  searchReports,
} = require('../controllers/reportController');
const csrf = require('csrf');
const checkDomain = require('../utils/checkDomain');
const Report = require('../models/reportModel');
const tokens = new csrf();

const router = express.Router();

router.post('/', createReport);
router.get('/search', searchReports);

router.get('/check-domain', async (req, res) => {
  const { domain } = req.query;

  console.log(`Received request to check domain: ${domain}`);

  try {
    const report = await Report.findOne({ enlace: domain });
    console.log(`Report found: ${report ? 'Yes' : 'No'}`);

    if (report) {
      const oneHour = 1 * 60 * 60 * 1000; // 1 hora en milisegundos
      const now = new Date();

      if (report.lastChecked) {
        console.log(`Last checked: ${report.lastChecked}`);
        console.log(`Current time: ${now}`);
        console.log(`Time difference: ${now - new Date(report.lastChecked)}`);
      }

      if (report.lastChecked && now - new Date(report.lastChecked) < oneHour) {
        // Si el dominio ha sido verificado en la última hora, devuelve el estado almacenado
        console.log(
          `Returning cached status for ${domain}: ${report.domainStatus}`
        );
        return res.json({ status: report.domainStatus });
      }

      // Si el estado ha expirado, realiza una nueva verificación
      const status = await checkDomain(domain);
      report.domainStatus = status;
      report.lastChecked = now;
      await report.save();

      console.log(`Updated status for ${domain}: ${status}`);
      return res.json({ status });
    } else {
      // Si no existe un reporte, crea uno nuevo y verifica el dominio
      const status = await checkDomain(domain);
      const newReport = new Report({
        telefono: 'unknown',
        enlace: domain,
        texto: 'unknown',
        domainStatus: status,
        lastChecked: new Date(),
      });
      await newReport.save();

      console.log(`Created new report for ${domain} with status: ${status}`);
      return res.json({ status });
    }
  } catch (error) {
    console.log(`Error in /check-domain route: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
});

router.get('/csrf-token', (req, res) => {
  const token = req.cookies['XSRF-TOKEN'];
  if (!token) {
    const newToken = tokens.create(process.env.CSRF_SECRET);
    res.cookie('XSRF-TOKEN', newToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    });
    return res.json({ csrfToken: newToken });
  }
  return res.json({ csrfToken: token });
});

module.exports = router;
