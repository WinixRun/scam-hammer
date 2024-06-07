const Report = require('../models/reportModel');

const extractDomain = (url) => {
  try {
    const { hostname } = new URL(url);
    return hostname;
  } catch (error) {
    console.error('Error extracting domain:', error.message);
    return null;
  }
};

const identifyPattern = (domain) => {
  const parts = domain.split('.');
  if (parts.length > 2) {
    return parts.slice(-2).join('.');
  }
  return domain;
};

const updateRelatedDomains = async () => {
  try {
    const reports = await Report.find({});
    for (const report of reports) {
      const domain = extractDomain(report.enlace);
      const pattern = identifyPattern(domain);
      const relatedReports = await Report.find({
        enlace: { $regex: pattern, $options: 'i' },
      });

      const relatedDomains = relatedReports.map((r) => extractDomain(r.enlace));
      report.dominiosRelacionados = [...new Set(relatedDomains)];
      await report.save();
    }
    console.log('Related domains updated successfully.');
  } catch (error) {
    console.error('Error updating related domains:', error.message);
  }
};

module.exports = {
  updateRelatedDomains,
};
