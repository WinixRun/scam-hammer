const axios = require('axios');

const checkDomain = async (domain) => {
  if (!domain) {
  }

  try {
    let response;
    try {
      response = await axios.get(domain, { maxRedirects: 10 });
    } catch (httpError) {
      response = await axios.get(domain, { maxRedirects: 10 });
    }

    if (response && response.status >= 200 && response.status < 400) {
      return 'up';
    }
    return 'down';
  } catch (error) {
    return 'down';
  }
};

module.exports = checkDomain;
