const mongoose = require('mongoose');

const ipLogSchema = new mongoose.Schema({
  ipAddress: String,
  timestamp: { type: Date, default: Date.now },
});

const IpLog = mongoose.model('IpLog', ipLogSchema);

module.exports = IpLog;
