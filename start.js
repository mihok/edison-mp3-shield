// var Edison = require('./libs/EdisonArduinoBreakout')
var MP3Shield = require('./libs/MP3PlayerShield');

var wave = new MP3Shield();
var EXIT = 0;

var EXIT_timeout = function () {
  EXIT = 1;
};

var EXIT_health = function () {
  console.log('PING PONG');
};

wave.setup(function () {
  console.log('MP3Shield:', 'Ready');

  EXIT = 1;
});

while(!EXIT) {
  setTimeout(EXIT_health, 1000);
  setTimeout(EXIT_timeout, 120000);
}
