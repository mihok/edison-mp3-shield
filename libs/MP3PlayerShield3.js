'use strict';
var MRAA = require('mraa');
var ISR = require('./ISR.js');

// DATA ////////////////////////////////////////////////////////////////////////

var helloMP3 = require('./sample.js');


// GPIO Pins ///////////////////////////////////////////////////////////////////

var LOW = 0;
var HIGH = 1;

var AUDIO_DREQ = 2; // Data Request Pin; VS1053 OUTPUT, interrupt
var AUDIO_MIDI = 3; // MIDI-In Pin; VS1053 INPUT
var AUDIO_CS = 6;   // Control Chip Select Pin; VS1053 INPUT
var AUDIO_DCS = 7;  // Data Chip Select Pin; VS1053 INPUT
var AUDIO_RST = 8;  // Reset Pin; VS1053 INPUT

var SD_CS = 9;      // Control Chip Select Pin; MicroSD INPUT

var SPI_DEFAULT = 0;   // SPI Default
var SPI_FS = 10;   // SPI ?
var SPI_OUT = 11;   // SPI Transmit (Tx)
var SPI_IN = 12;    // SPI Recieve (Rx)
var SPI_CLOCK = 13; // SPI Clock


// VS10xx SCI Registers ////////////////////////////////////////////////////////

var SCI_MODE = 0x00;
var SCI_STATUS = 0x01;
var SCI_BASS = 0x02;
var SCI_CLOCKF = 0x03;
var SCI_DECODE_TIME = 0x04;
var SCI_AUDATA = 0x05;
var SCI_WRAM = 0x06;
var SCI_WRAMADDR = 0x07;
var SCI_HDAT0 = 0x08;
var SCI_HDAT1 = 0x09;
var SCI_AIADDR = 0x0A;
var SCI_VOL = 0x0B;
var SCI_AICTRL0 = 0x0C;
var SCI_AICTRL1 = 0x0D;
var SCI_AICTRL2 = 0x0E;
var SCI_AICTRL3 = 0x0F;


// Constructor

function Shield (options) {
  console.log('MP3Shield:', 'MRAA Version', MRAA.getVersion());

  // GPIO

  // VS1053
  console.log('MP3Shield:', 'Initalizing VS1053 data request interrupt ..');
  this.Audio_DREQ = new ISR(AUDIO_DREQ, MRAA.EDGE_RISING);

  console.log('MP3Shield:', 'Initalizing VS1053 chip select input ..');
  this.Audio_CS = new MRAA.Gpio(AUDIO_CS);
  this.Audio_CS.dir(MRAA.DIR_OUT);

  console.log('MP3Shield:', 'Initalizing VS1053 data chip select input ..');
  this.Audio_DCS = new MRAA.Gpio(AUDIO_DCS);
  this.Audio_DCS.dir(MRAA.DIR_OUT);

  console.log('MP3Shield:', 'Initalizing VS1053 reset input ..');
  this.Audio_Reset = new MRAA.Gpio(AUDIO_RST);
  this.Audio_Reset.dir(MRAA.DIR_OUT);

  // SD
  console.log('MP3Shield:', 'Initalizing SD chip select input ..');
  this.SD_CS = new MRAA.Gpio(SD_CS);

  // Seems as though you only need to initialize SPI once, not all 3/4
  //  separately
  console.log('MP3Shield:', 'Initalizing SPI ..');
  this.SPI = new MRAA.Spi(SPI_DEFAULT);
}

Shield.prototype.writeRegister = function (addressByte, highByte, lowByte) {
  while(this.Audio_DREQ.wait())

  console.log('Debug:', 'AUDIO_CS', LOW, this.Audio_CS.write(LOW));

  var buffer = new Buffer(4);
  buffer[0] = 0x02;
  buffer[1] = addressByte;
  buffer[2] = highByte;
  buffer[3] = lowByte;

  console.log('Debug:', 'SPI', buffer, this.SPI.write(buffer));

  while(this.Audio_DREQ.wait())

  console.log('Debug:', 'AUDIO_CS', HIGH, this.Audio_CS.write(HIGH));
};

Shield.prototype.readRegister = function (addressByte) {
  var firstResponse, secondResponse, result;

  while(this.Audio_DREQ.wait())

  console.log('Debug:', 'AUDIO_CS', LOW, this.Audio_CS.write(LOW));

  var buffer = new Buffer(4);
  buffer[0] = 0x03;
  buffer[1] = addressByte;

  console.log('Debug:', 'SPI', buffer, this.SPI.write(buffer));

  firstResponse = this.SPI.write(new Buffer (0xFF));

  while(this.Audio_DREQ.wait())

  secondResponse = this.SPI.write(new Buffer (0xFF));

  while(this.Audio_DREQ.wait())

  console.log('Debug:', 'AUDIO_CS', HIGH, this.Audio_CS.write(HIGH));

  result = firstResponse << 8 | secondResponse;

  return result;
};

Shield.prototype.setVolume  = function (left, right) {
  console.log('MP3Shield:', 'Setting volume to', left, 'L ', right, 'R');
  this.writeRegister(SCI_VOL, left, right);
};

Shield.prototype.setup = function (callback) {
  var MP3Mode, MP3Status, MP3Clock, VSVersion;
  var that = this;

  // Setup SPI for VS1053
  console.log('MP3Shield:', 'Writing SPI LSB transmission mode 0 (MSB)');
  console.log('Debug:', this.SPI.lsbmode(false));
  console.log('MP3Shield:', 'Writing SPI mode 0');
  console.log('Debug:', this.SPI.mode(0));
  console.log('MP3Shield:', 'Setting clock to 1MHz');
  console.log('Debug:', this.SPI.frequency(process.env.FREQ || 1000000));

  // Reset
  console.log('Debug:', 'AUDIO_RST', LOW, this.Audio_Reset.write(LOW));
  setTimeout(function() {
    console.log('Debug:', 'AUDIO_RST', HIGH, this.Audio_Reset.write(HIGH));
  }, 100);

  console.log('Debug:', this.SPI.write(new Buffer(0xFF)));

  // De-select Control
  console.log('Debug:', 'AUDIO_CS', HIGH, this.Audio_CS.write(HIGH));

  // De-select Data
  console.log('Debug:', 'AUDIO_DCS', HIGH, this.Audio_DCS.write(HIGH));

  this.setVolume(20, 20);

  console.log('MP3Shield:', 'Reading SCI_MODE ...');
  MP3Mode = this.readRegister(SCI_MODE);
  console.log('MP3Shield:', 'SCI_Mode (0x4800) = 0x' + MP3Mode.toString('hex'));

  console.log('MP3Shield:', 'Reading SCI_STATUS ...');
  MP3Status = this.readRegister(SCI_STATUS);
  console.log('MP3Shield:', 'VSx version ', VSVersion.toString('hex'));

  console.log('MP3Shield:', 'Reading SCI_CLOCKF ...');
  MP3Clock = this.readRegister(SCI_CLOCKF);
  console.log('MP3Shield:', 'SCI_ClockF = 0x' + MP3Clock.toString('hex'));
  console.log('MP3Shield:', 'Setting SCI_CLOCKF to 4MHz ... ');
  this.SPI.frequency(4000000);
  console.log('MP3Shield:', 'Reading SCI_CLOCKF ...');
  MP3Clock = this.readRegister(SCI_CLOCKF);
  console.log('MP3Shield:', 'SCI_ClockF = 0x' + MP3Clock.toString('hex'));


  console.log('FUCK YEAH SUCCESS!!!!');
};

module.exports = Shield;
