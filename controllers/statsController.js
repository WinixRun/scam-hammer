const Report = require('../models/reportModel');

const getReportsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const reports = await Report.find({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReportsGroupedByEntity = async (req, res) => {
  try {
    const reports = await Report.aggregate([
      {
        $group: {
          _id: '$entidadSuplantada',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getReportsByDateRange,
  getReportsGroupedByEntity,
};
