const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const fetchMyIP = callback => {
  // fetch from JSON API an IP addy using 'request'
  request('https://api.ipify.org?format=json', (error, resp, body) => {
    if (error) return callback(error, null);

    if (resp.statusCode !== 200) {
    callback(Error(`Status Code ${resp.statusCode} when fetching coordinates for IP. Response: ${body}`), null);
    return;
  }

  // callback(null, JSON.parse(body).ip);
  const ip = JSON.parse(body).ip;
  callback(null, ip);
  });
};

/**
 * Makes a single API request to retrieve the lat/lng for a given IPv4 address.
 * Input:
 *   - The ip (ipv4) address (string)
 *   - A callback (to pass back an error or the lat/lng object)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The lat and lng as an object (null if error). Example:
 *     { latitude: '49.27670', longitude: '-123.13000' }
 */

const fetchCoordsByIP = (ip, callback2) => {
  // request('https://api.ipify.org?format=json', (error, resp, body) => {
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

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

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */

const fetchISSFlyOverTimes = function(coords, callback) {
const url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;

request(url, (error, response, body) => {
  if (error) {
    callback(error, null);
    return;
  }

  if (response.statusCode !== 200) {
    callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
    return;
  }

  const passes = JSON.parse(body).response;
  callback(null, passes);
});
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

// module.exports = fetchMyIP;
// module.exports = fetchCoordsByIP;
// module.exports = fetchISSFlyOverTimes;
// Only export nextISSTimesForMyLocation and not the other three (API request) functions.
// This is because they are not needed by external modules.
module.exports = nextISSTimesForMyLocation;