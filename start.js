// var Edison = require('./libs/EdisonArduinoBreakout')
var MP3Shield = require('./libs/MP3PlayerShield2');

var wave = new MP3Shield();
wave.setup();
// var EXIT = 0;

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
