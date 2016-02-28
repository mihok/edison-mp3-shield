// var Edison = require('./libs/EdisonArduinoBreakout')
var MP3Shield = require('./libs/MP3PlayerShield');

var wave = new MP3Shield();
var EXIT = 0;

wave.setup(function () {
  console.log('MP3Shield:', 'Ready');

  EXIT = 1;
});

while(!EXIT);
