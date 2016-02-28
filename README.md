# Edison-MP3-shield
Intel Edison with the SparkFun MP3 Player Shield and Edison Arduino Breakout board

## IO11-13 SPI Pin Mode

###### Example 5: Configure IO10-13 for SPI connectivity

1. The shield pins are IO10, IO11, IO12 and IO13. Corresponding GPIO numbers are GPIO 111, 115, 114, and 109, respectively.
2. The function required is SPI. According to Table 1, other functions available on these pins are: GPIO, PWM
3. According to Table 3, GPIO 263 must be set to 1 to select GPIO/SPI, GPIO 240 must be set to 1 to select SPI, and GPIO 111 pin-mux must be set to ‘mode1’ to select SPI for IO10
4. According to Table 3, GPIO 262 must be set to 1 to select GPIO/SPI, GPIO 241 must be set to 1 to select SPI, and GPIO 115 pin-mux must be set to ‘mode1’ to select SPI for IO11
5. According to Table 3, GPIO 242 must be set to 1 to select SPI, and GPIO 114 pin-mux must be set to ‘mode1’ to select SPI for IO12
6. According to Table 3, GPIO 243 must be set to 1 to select SPI, and GPIO 109 pin-mux must be set to ‘mode1’ to select SPI for IO13
7. According to Table 4, GPIO 258 must be set to 1 to enable the output direction for IO10, GPIO 259 must be set to 1 to enable the output direction for IO11, GPIO 260 must be set to 0 to disable the output direction for IO12, and GPIO 261 must be set to 1 to enable the output direction for IO13.
8. According to Table 4, GPIOs 226-229 must be set as high-impedance inputs to disable the pull-up resistors for IO10-13.
9. According to Table 5, the TRI_STATE_ALL signal is controlled by GPIO 214

So, the commands in Linux to achieve this are as follows:

```
echo 111 > /sys/class/gpio/export
echo 115 > /sys/class/gpio/export
echo 114 > /sys/class/gpio/export
echo 109 > /sys/class/gpio/export
echo 263 > /sys/class/gpio/export
echo 240 > /sys/class/gpio/export
echo 262 > /sys/class/gpio/export
echo 241 > /sys/class/gpio/export
echo 242 > /sys/class/gpio/export
echo 243 > /sys/class/gpio/export
echo 258 > /sys/class/gpio/export
echo 259 > /sys/class/gpio/export
echo 260 > /sys/class/gpio/export
echo 261 > /sys/class/gpio/export
echo 226 > /sys/class/gpio/export
echo 227 > /sys/class/gpio/export
echo 228 > /sys/class/gpio/export
echo 229 > /sys/class/gpio/export
echo 214 > /sys/class/gpio/export
echo low > /sys/class/gpio/gpio214/direction
echo high > /sys/class/gpio/gpio263/direction
echo high > /sys/class/gpio/gpio240/direction
echo high > /sys/class/gpio/gpio262/direction
echo high > /sys/class/gpio/gpio241/direction
echo high > /sys/class/gpio/gpio242/direction
echo high > /sys/class/gpio/gpio243/direction
echo high > /sys/class/gpio/gpio258/direction
echo high > /sys/class/gpio/gpio259/direction
echo low > /sys/class/gpio/gpio260/direction
echo high > /sys/class/gpio/gpio261/direction
echo in > /sys/class/gpio/gpio226/direction
echo in > /sys/class/gpio/gpio227/direction
echo in > /sys/class/gpio/gpio228/direction
echo in > /sys/class/gpio/gpio229/direction
echo mode1 > /sys/kernel/debug/gpio_debug/gpio111/current_pinmux
echo mode1 > /sys/kernel/debug/gpio_debug/gpio115/current_pinmux
echo mode1 > /sys/kernel/debug/gpio_debug/gpio114/current_pinmux
echo mode1 > /sys/kernel/debug/gpio_debug/gpio109/current_pinmux
echo high > /sys/class/gpio/gpio214/direction
```

## Resources

- https://learn.sparkfun.com/tutorials/mp3-player-shield-hookup-guide-v15
- https://github.com/sparkfun/MP3_Player_Shield/tree/V_1.5
- https://github.com/madsci1016/Sparkfun-MP3-Player-Shield-Arduino-Library
- https://github.com/greiman?tab=repositories
- https://en.wikipedia.org/wiki/Intel_Edison
- https://github.com/intel-iot-devkit/mraa/blob/master/docs/edison.md
- http://www.emutexlabs.com/project/215-intel-edison-gpio-pin-multiplexing-guide
- http://www.musicpd.org/doc/user/
- http://www.musicpd.org/clients/mpc/
- https://wiki.archlinux.org/index.php/Music_Player_Daemon

## Extended Resources

- http://www.zeroconf.org/
- https://en.wikipedia.org/wiki/Avahi_%28software%29
- https://wiki.ubuntu.com/PulseAudio
- https://www.freedesktop.org/wiki/Software/PulseAudio/
- http://www.icecast.org/
