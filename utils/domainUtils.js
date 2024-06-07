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
  const reports = await Report.find({});
  const domainMap = {};

  reports.forEach((report) => {
    const domain = extractDomain(report.enlace);
    const pattern = identifyPattern(domain);
    if (!domainMap[pattern]) {
      domainMap[pattern] = [];
    }
    domainMap[pattern].push(domain);
  });

  for (const report of reports) {
    const domain = extractDomain(report.enlace);
    const pattern = identifyPattern(domain);
    const relatedDomains = domainMap[pattern].filter((d) => d !== domain);
    report.dominiosRelacionados = [...new Set(relatedDomains)];
    await report.save();
  }
};

module.exports = {
  extractDomain,
  identifyPattern,
  updateRelatedDomains,
};
