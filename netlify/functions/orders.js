exports.handler = async function(event) {
  const token = event.headers['x-token'] || '';
  const SHOP_ID = 339;
  
  try {
    const response = await fetch(
      `https://beton2go.primarkets.fr/api/v1/om/orders?filter%5Border%5D=orderDate+DESC&page=&shopId=${SHOP_ID}&size=50`,
      {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json',
          'Current-Shop': String(SHOP_ID)
        }
      }
    );
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch(err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
