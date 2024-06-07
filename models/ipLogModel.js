const mongoose = require('mongoose');

const ipLogSchema = new mongoose.Schema(
  {
    ipAddress: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      expires: '20m',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('IpLog', ipLogSchema);
