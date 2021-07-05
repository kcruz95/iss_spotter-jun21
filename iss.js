const fetchMyIP = callback => {
  // fetch from JSON API an IP addy using 'request'
  request('https://api.ipify.org?format=json', (error, resp, body) => {
    if (error) return callback(error, null);

    if (resp.statusCode !== 200) {
    callback(Error(`Status Code ${resp.statusCode} when fetching coordinates for IP. Response: ${body}`), null);
    return;
  }

  callback(null, JSON.parse(body).ip);

  });
};

const fetchCoordsByIP = (ip, callback2) => {
  request('https://api.ipify.org?format=json', (error, resp, body) => {
    if (error) {
      return callback2(error, null)
    };

    if (resp.statusCode !== 200) {
      callback2(Error(`Status Code ${resp.statusCode} when fetching coordinates for IP. Response: ${body}`), null);
      return;
    }

    const latitude = (JSON.parse(body))["data"];
    const longitude = (JSON.parse(body))["data"];
    console.log(`The ISS coordinates are: ${latitude}, ${longitude}`)

    callback(null, {
      latitude,
      longitude
    });
  });
};

module.exports = fetchMyIP;
module.exports = fetchCoordsByIP;