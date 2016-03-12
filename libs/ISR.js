'use strict';
var MRAA = require('mraa');
var EventEmitter = require('events');

var util = require('util');

function ISR (gpio, mode) {
  this.fired = false;

  this.gpio = new MRAA.Gpio(gpio || -1);
  this.gpio.dir(MRAA.DIR_IN);
  this.gpio.isr(mode || MRAA.EDGE_BOTH, this.handler());

  EventEmitter.call(this);
}

util.inherits(ISR, EventEmitter);

ISR.prototype.handler = function () {
  var that = this;
  return function () {
    console.log('Debug:', 'ISR', 'INTERRUPT!');
    that.fired = true;
    that.emit('interrupt');
    that.fired = false;
  };
};

module.exports = ISR;
