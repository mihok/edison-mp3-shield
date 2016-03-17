
var unixtime = function () {
  return Math.round(Date.now()/1000, 10);
};

module.exports = {
  unixtime: unixtime
};
