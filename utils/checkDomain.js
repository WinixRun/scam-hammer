const axios = require('axios');

const checkDomain = async (domain) => {
  if (!domain) {
    return 'unknown';
  }

  try {
    const response = await axios.get(domain, {
      maxRedirects: 10,
      timeout: 5000,
    });
    if (response && response.status >= 200 && response.status < 400) {
      return 'up';
    }
    return 'down';
  } catch (error) {
    return 'unknown';
  }
};

module.exports = checkDomain;
