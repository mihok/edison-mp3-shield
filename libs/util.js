
var unixtime = function () {
  return parseFloat(Date.now()/1000, 10).toFixed(5);
};

module.exports = {
  unixtime: unixtime
};
