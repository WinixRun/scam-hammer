const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    telefono: {
      type: String,
      required: true,
    },
    enlace: {
      type: String,
      required: true,
    },
    texto: {
      type: String,
      required: true,
    },
    cantidad: {
      type: Number,
      default: 1,
    },
    domainStatus: {
      type: String,
      default: 'unknown',
    },
    lastChecked: {
      type: Date,
      default: null,
    },
    whoisData: {
      type: Object,
      default: null,
    },
    lastWhoisCheck: {
      type: Date,
      default: null,
    },
    ipAddress: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Report', reportSchema);
