'use strict';
var MRAA = require('mraa');
var EventEmitter = require('events');

var util = require('util');
var Util = require('./util.js');

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
    console.log('[' + Util.unixtime() + ']', 'Debug:', 'ISR', 'INTERRUPT!', arguments);
    that.fired = true;
    that.emit('interrupt');
    that.fired = false;
  };
};

module.exports = ISR;
