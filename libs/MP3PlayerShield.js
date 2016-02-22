var MRAA = require('mraa');


// GPIO Pins ///////////////////////////////////////////////////////////////////

var AUDIO_DREQ = 2; // Data Request Pin; VS1053 OUTPUT, interrupt

var AUDIO_MIDI = 3; // MIDI-In Pin; VS1053 INPUT

var AUDIO_CS = 6;   // Control Chip Select Pin; VS1053 INPUT
var AUDIO_DCS = 7;  // Data Chip Select Pin; VS1053 INPUT
var AUDIO_RST = 8;  // Reset Pin; VS1053 INPUT

var SD_CS = 9;      // Control Chip Select Pin; MicroSD INPUT

var SPI_FS = 10;   // SPI Send
var SPI_OUT = 11;   // SPI Send
var SPI_IN = 12;    // SPI Recieve
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

class Shield {
  constructor() { }

  start () {
    // GPIO
    this.audio_dreq = MRAA.Gpio(AUDIO_DREQ);
    this.audio_dreq.dir(MRAA.DIR_IN);

    this.audio_cs = MRAA.Gpio(AUDIO_CS);
    this.audio_cs.dir(MRAA.DIR_OUT);

    this.audio_dcs = MRAA.Gpio(AUDIO_DCS);
    this.audio_dcs.dir(MRAA.DIR_OUT);

    this.audio_reset = MRAA.Gpio(AUDIO_RST);
    this.audio_dcs.dir(MRAA.DIR_OUT);

    this.sd_cs = MRAA.Gpio(SD_CS);

    // SPI
    // this.spi_fs = MRAA.Gpio(SPI_FS);
    // this.spi_send = MRAA.Gpio(SPI_OUT);
    // this.spi_recieve = MRAA.Gpio(SPI_IN);
    // this.spi_clock = MRAA.Gpio(SPI_CLOCK);

    // GPIO
  }
}

module.exports = Shield;
