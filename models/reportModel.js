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
    relatedDomains: {
      type: [String],
      default: ['De momento no hay dominios relacionados'],
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.statics.findRelatedDomains = async function (domain) {
  const regex = new RegExp(domain.replace('.', '\\.'), 'i');
  const relatedReports = await this.find({ enlace: { $regex: regex } });
  return relatedReports.map((report) => report.enlace);
};

reportSchema.statics.updateRelatedDomains = async function () {
  const reports = await this.find({});
  for (const report of reports) {
    const relatedDomains = await this.findRelatedDomains(report.enlace);
    report.relatedDomains = relatedDomains.filter((d) => d !== report.enlace);
    if (report.relatedDomains.length === 0) {
      report.relatedDomains.push('De momento no hay dominios relacionados');
    }
    await report.save();
  }
};

module.exports = mongoose.model('Report', reportSchema);
