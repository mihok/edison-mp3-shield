'use strict';
var MRAA = require('mraa');
var EventEmitter = require('events');

var util = require('util');

function ISR (gpio, mode) {
  this.fired = false;
  this.waiting = false;

  this.gpio = new MRAA.Gpui(gpio || -1);
  this.gpio.dir(MRAA.DIR_IN);
  this.gpio.isr(mode || MRAA.EDGE_BOTH, this.handler);


  EventEmitter.call(this);
}

util.inherits(ISR, EventEmitter);


ISR.prototype.wait = function () {
  // if (!this.waiting) {
  //   this.waiting = true;
  // }

  if (this.fired) {
    this.fired = false;
    return false;
  }
  return true;
};

ISR.prototype.handler = function () {
  this.emit('interrupt');
  this.fired = true;
};

module.exports = ISR;
