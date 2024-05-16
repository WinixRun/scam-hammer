const axios = require('axios');

const checkDomain = async (domain) => {
  if (!domain) {
    throw new Error('Domain is required');
  }

  console.log(`Verifying domain: ${domain}`);

  try {
    let response;
    try {
      console.log(`Trying ${domain}`);
      response = await axios.get(domain, { maxRedirects: 10 });
    } catch (httpError) {
      console.log(`Failed ${domain}, trying ${domain}`);
      response = await axios.get(domain, { maxRedirects: 10 });
    }

    if (response && response.status >= 200 && response.status < 400) {
      console.log(`Domain ${domain} is up`);
      return 'up';
    }
    console.log(`Domain ${domain} is down`);
    return 'down';
  } catch (error) {
    console.log(`Error verifying domain ${domain}: ${error.message}`);
    return 'down';
  }
};

module.exports = checkDomain;
