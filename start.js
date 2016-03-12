// var Edison = require('./libs/EdisonArduinoBreakout')
var MP3Shield = require('./libs/MP3PlayerShield3.js');

var wave = new MP3Shield();
var loop = function () {
  console.log('PING PONG');
  setTimeout(loop, 1000);
};

wave.setup();
loop();
// var EXIT_timeout = function () {
//   EXIT = 1;
// };

// var EXIT_health = function () {
//   console.log('PING PONG');
// };

// wave.setup(function () {
//   console.log('MP3Shield:', 'Ready');

//   EXIT = 1;
// });

// while(!EXIT) {
//   setInterval(EXIT_health, 1000);
//   setInterval(EXIT_timeout, 120000);
// }
