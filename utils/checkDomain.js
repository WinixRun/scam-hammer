const axios = require('axios');

const checkDomain = async (domain) => {
  if (!domain) {
    throw new Error('No domain provided');
  }

  // Asegurar que el dominio tiene el esquema (http o https)
  if (!/^https?:\/\//i.test(domain)) {
    domain = 'http://' + domain;
  }

  try {
    let response;
    try {
      response = await axios.get(domain, { maxRedirects: 10 });
    } catch (httpError) {
      // Si falla con http, intenta con https
      if (domain.startsWith('http://')) {
        domain = domain.replace('http://', 'https://');
      } else if (domain.startsWith('https://')) {
        domain = domain.replace('https://', 'http://');
      }
      response = await axios.get(domain, { maxRedirects: 10 });
    }

    if (response && response.status >= 200 && response.status < 400) {
      return 'up';
    }
    return 'down';
  } catch (error) {
    console.error(`Error checking domain ${domain}:`, error.message);
    return 'down';
  }
};

module.exports = checkDomain;
