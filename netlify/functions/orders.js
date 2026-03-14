const https = require('https');

exports.handler = async function(event) {
  const token = event.headers['x-token'] || '';
  const SHOP_ID = 339;
  
  const url = `https://beton2go.primarkets.fr/api/v1/om/orders?filter%5Border%5D=orderDate+DESC&page=&shopId=${SHOP_ID}&size=50`;

  return new Promise((resolve) => {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json',
        'Current-Shop': String(SHOP_ID)
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: data
        });
      });
    }).on('error', (err) => {
      resolve({
        statusCode: 500,
        body: JSON.stringify({ error: err.message })
      });
    });
  });
};
Valide les modifications et attends le redéploiement 👍j'ai toujours erreur api  50008:47On va voir exactement ce qui se passe. Sur GitHub, remplace le contenu de netlify/functions/orders.js par cette version de débogage :
javascriptconst https = require('https');

exports.handler = async function(event) {
  const token = event.headers['x-token'] || 'NO_TOKEN';
  const SHOP_ID = 339;
  
  const url = `beton2go.primarkets.fr`;
  const path = `/api/v1/om/orders?filter%5Border%5D=orderDate+DESC&page=&shopId=${SHOP_ID}&size=50`;

  return new Promise((resolve) => {
    const options = {
      hostname: url,
      path: path,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json',
        'Current-Shop': String(SHOP_ID),
        'User-Agent': 'Mozilla/5.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: 200,
          headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: res.statusCode,
            headers: res.headers,
            data: data.substring(0, 500)
          })
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: err.message, code: err.code })
      });
    });

    req.end();
  });
};
