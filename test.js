"use strict";

var m = require('mraa');
console.log('MRAA Version: ' + m.getVersion());

var counter   = 0;
var interrupt = 0;
var led_state = 0;
var argument  = 'myargument';

/*
function callback(arg) {
  interrupt++;
  console.log(arg);
}
*/

var callback = function(arg) {
  interrupt++;
  console.log(arg);
};

var myled    = new m.Gpio(13);
myled.dir(m.DIR_OUT);

var mybutton = new m.Gpio(2);
mybutton.dir(m.DIR_IN);
mybutton.isr(m.EDGE_BOTH, callback, argument);

function mainloop() {
  myled.write(led_state = led_state ? 0 : 1);
  counter++;
  console.log('counter = ' + counter + ' -- interrupt done = ' + interrupt);
  setTimeout(mainloop, 1000);
}

mainloop();
