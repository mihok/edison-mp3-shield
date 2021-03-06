'use strict';
var MRAA = require('mraa');
var Promise = require("bluebird");

// DATA ////////////////////////////////////////////////////////////////////////

var helloMP3 = require('./sample');


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


function Shield (options) {
  console.log('MP3Shield:', 'MRAA Version', MRAA.getVersion());

  // GPIO

  // VS1053
  console.log('MP3Shield:', 'Initalizing VS1053 data request interrupt ..');
  this.Audio_DREQ = new MRAA.Gpio(AUDIO_DREQ);
  this.Audio_DREQ.dir(MRAA.DIR_IN);

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

Shield.prototype.waitForDREQ = function () {
  var deferred = Promise.pending();

  console.log('MP3Shield:', 'Starting ISR ...',
    this.Audio_DREQ.isr(MRAA.EDGE_FALLING, function () {
      console.log('MP3Shield:', 'ISR!', arguments);
      deferred.resolve();
    }
  ));

  return deferred.promise;
};

Shield.prototype.writeRegister = function (addressByte, highByte, lowByte) {
  var that = this;
  var deferred = Promise.pending();

  this.waitForDREQ()
    .then(function () {
      console.log('MP3Shield:', 'CS_LOW', that.cs_low());

      var buffer = new Buffer(4);
      buffer[0] = 0x02;
      buffer[1] = addressByte;
      buffer[2] = highByte;
      buffer[3] = lowByte;

      console.log('Debug:', that.SPI.write(buffer));

      return that.waitForDREQ();
    })
    .then(function () {
      console.log('MP3Shield:', 'CS_HIGH', that.cs_high());

      return deferred.resolve();
    });

  return deferred.promise;
};

Shield.prototype.readRegister = function (addressByte) {
  var that = this;
  var firstResponse, secondResponse, result;
  var deferred = Promise.pending();

  this.waitForDREQ()
    .then(function () {
      console.log('MP3Shield:', 'CS_LOW', that.cs_low());

      var buffer = new Buffer(2);
      buffer[0] = 0x03;
      buffer[1] = addressByte;

      console.log('Debug:', that.SPI.write(buffer));

      firstResponse = that.SPI.write(new Buffer(0xFF));
      that.Audio_DREQ.isr(MRAA.EDGE_RISING, function () {
        secondResponse = that.SPI.write(new Buffer(0xFF));

        that.waitForDREQ()
          .then(function () {
            console.log('MP3Shield:', 'CS_HIGH', that.cs_high());

            console.log('Debug:', firstResponse.toString('hex'));
            console.log('Debug:', secondResponse.toString('hex'));

            result = firstResponse << 8 | secondResponse;

            console.log('Debug:', result.toString('hex'));

            return that.waitForDREQ();
          })
          .then(function () {
            deferred.resolve(result);
          });
      });
    });

  return deferred.promise;
};

Shield.prototype.setVolume  = function (left, right) {
  console.log('MP3Shield:', 'Setting volume to', left, 'L ', right, 'R');
  return this.writeRegister(SCI_VOL, left, right);
};

Shield.prototype.cs_low = function () {
  this.init();
  return this.Audio_CS.write(LOW);
};

Shield.prototype.cs_high = function () {
  return this.Audio_CS.write(HIGH);
};

Shield.prototype.dcs_low = function () {
  this.init();
  return this.Audio_DCS.write(LOW);
};

Shield.prototype.dcs_high = function () {
  return this.Audio_DCS.write(HIGH);
};

Shield.prototype.init = function () {
  console.log('MP3Shield:', 'Writing SPI LSB transmission mode 0 (MSB)');
  console.log('Debug:', this.SPI.lsbmode(false));
  console.log('MP3Shield:', 'Writing SPI mode 0');
  console.log('Debug:', this.SPI.mode(0));
  console.log('MP3Shield:', 'Setting clock to 1MHz');
  console.log('Debug:', this.SPI.frequency(process.env.FREQ || 1000000));
};

Shield.prototype.setup = function () {
  var that = this;

  // this.init();

  // De-select Control
  console.log('Debug:', 'CS_HIGH', this.cs_high());

  // De-select Data
  console.log('Debug:', 'DCS_HIGH', this.dcs_high());

  this.reset()
    .then (function () {
      return that.readRegister(SCI_MODE);
    })
    .then (function (MP3Mode) {
      console.log('MP3Shield:', 'SCI_Mode (0x4800) = 0x' + MP3Mode.toString('hex'));

      return that.readRegister(SCI_STATUS);
    })
    .then (function (MP3Status) {
      console.log('SCI_Status (0x48) = 0x' + MP3Status.toString('hex'));

      return that.readRegister(SCI_CLOCKF);
    })
    .then (function (MP3Clock) {
      console.log('SCI_ClockF = 0x' + MP3Clock.toString('hex'));

      return that.writeRegister(SCI_CLOCKF, 0x6000, 0x00);
    })
    .delay(100)
    .then (function () {
      return that.readRegister(SCI_CLOCKF);
    })
    .then(function (MP3Clock) {
      console.log('SCI_ClockF = 0x' + MP3Clock.toString('hex'));

      return that.setVolume(20, 20);
    });

};

Shield.prototype.reset = function () {
  var that = this;
  var deferred = Promise.pending();
  // Reset
  console.log('Debug:', 'RESET_LOW', this.Audio_Reset.write(LOW));
  setTimeout(function() {
    console.log('Debug:', 'RESET_HIGH', that.Audio_Reset.write(HIGH));

    deferred.resolve();
  }, 100);

  return deferred.promise;
};

module.exports = Shield;


/*
  // Reset
  console.log('Debug:', this.Audio_Reset.write(LOW));
  setTimeout(function() {
    console.log('Debug:', this.Audio_Reset.write(HIGH));
  }, 100);
*/
