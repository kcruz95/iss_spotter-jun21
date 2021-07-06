const { fetchMyIP } = require('./iss_promised');
const { nextISSTimesForMyLocation } = require('./iss_promised');

  const fetchCoordsByIP = function(body) {
    const ip = JSON.parse(body).ip;
    return request(`https://freegeoip.app/json/${ip}`);
  };
  
  const fetchISSFlyOverTimes = function(body) {
    const { latitude, longitude } = JSON.parse(body);
    const url = `http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`;
    return request(url);
  };

  fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then(body => console.log(body));

  nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });

  module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes };