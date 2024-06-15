const express = require('express');
const {
  getReportsByDateRange,
  getReportsGroupedByEntity,
} = require('../controllers/statsController');

const router = express.Router();

router.get('/by-date', getReportsByDateRange);
router.get('/grouped-by-entity', getReportsGroupedByEntity);

module.exports = router;
