process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const https = require('https');

exports.handler = async function(event) {
  const token = event.headers['x-token'] || '';
  const SHOP_ID = 339;

  return new Promise((resolve) => {
    const options = {
      hostname: 'beton2go.primarkets.fr',
      port: 443,
      path: `/api/v1/om/orders?filter%5Border%5D=orderDate+DESC&page=&shopId=${SHOP_ID}&size=50`,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'fr-FR,fr;q=0.9',
        'Current-Locale': '3',
        'Current-Shop': String(SHOP_ID),
        'Origin': 'https://beton2go.primarkets.fr',
        'Referer': 'https://beton2go.primarkets.fr/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
          body: data || JSON.stringify({ status: res.statusCode })
        });
      });
    });

    req.on('error', err => {
      resolve({
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: err.message, code: err.code })
      });
    });

    req.end();
  });
};
