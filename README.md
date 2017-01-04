# Electrocat 

this is a repo for an electron app to controll a catbot.

it will allow non programmer to use a built catbot with it's arduino flashed with firmata

## dev prerequistes
### hardware

- an arduino
- 2 9g servo
- laser (or led laser)
- usb cable

### software

- arduino IDE or [gort](http://gort.io/) to flash firmata
- a gcc toolchain (xcode / build essential)
- node and npm

## Setup

- if you have a catbot at hand buid it (current model notice [here](http://lesnodebots.eu/build.html))
- flash the arduino with firmata
- install project dependencies ```npm i```

### code 

entrypoint is app/testBoard this test the board for firmata, and then will 
- create cat.rc
- calibrate the cat

### build

```npm run dist```

