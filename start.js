// var Edison = require('./libs/EdisonArduinoBreakout')
var MP3Shield = require('./libs/MP3PlayerShield');

var wave = new MP3Shield();
wave.setup(function () {
  console.log('MP3Shield:', 'Ready');
});
