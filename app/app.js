/* global requestAnimationFrame */
'use strict'
const dbg = require('debug')('catbot:app')
const controlView = require('./views/control')

dbg('app loaded')

const Gpad = require('./gamePad')
var five = require('johnny-five')

const canKey = require('./drawKeyboardCanvas')
const canDraw = require('./drawKeyboardCanvas').draw
const canLib = require('./drawGamepadCanvas')

const canGame = Gpad.canGame
const poolGp = Gpad.poolGp
const makeLaserPad = Gpad.makeLaserPad

const u = require('./utils')
const rng = u.convertRange // range converter

// patch j5 for missing stdin in electon
var Readable = require('stream').Readable
var util = require('util')
util.inherits(MyStream, Readable)
function MyStream (opt) {
  Readable.call(this, opt)
}
MyStream.prototype._read = function () {}
// hook in our stream
process.__defineGetter__('stdin', function () {
  if (process.__stdin) return process.__stdin
  process.__stdin = new MyStream()
  return process.__stdin
})

document.body.appendChild(controlView)

// const padInfo = document.getElementById('padInfoCont')
const stickACanvas = document.getElementById('axe1')

const cat = {
  rSpeed: 3, // speed of the relative mode (3° max per 1/60 th sec)
  forceKb: false, // dev mode
  ts: -1, // timestamp of the last gamepad event
  mode: 'mouse', // control mode 'mouse', 'gamepad' suported now
  gamePad: false, // is there a gamepad connected
  isRunning: true, // is the raf loop running
  hardware: false, // is there an arduino with firmata connected
  hwM: false, // should the hardware move this frame (not yet implemented)
  bot: {}, // contain x y laser, ref to the bot hw
  isLaserOn: false, // is the laser on ?
  pos: [90, 90],
  prevPos: [0, 0],
  isRealtive: true, // relative mode
  pad: {
    isBtActive: false,
    prevState: {}
  },
  window: {x: 0, y: 0}
}

function frame (timestamp) {
  let pad = {}
  switch (cat.mode) {
    case 'mouse':
      break
    case 'gamePad':

      pad = poolGp()
      canLib.draw(pad, stickACanvas)
      if (pad.a === true && cat.pad.isBtActive === false) {
        dbg('A dwn')
        cat.pad.isBtActive = true
      } else if (pad.a === false && cat.pad.isBtActive === true) {
        dbg('A rlz')
        if (cat.hardware === true) {
          cat.isLaserOn === true ? cat.bot.l.off() : cat.bot.l.on()
          cat.isLaserOn = !cat.isLaserOn
        }
        cat.pad.isBtActive = false
      }
      if (cat.isRealtive) {
        cat.pos[0] = cat.pos[0] + rng(pad.x, [-1, 1], [cat.rSpeed, -1 * cat.rSpeed])
        cat.pos[1] = cat.pos[1] + rng(pad.y, [-1, 1], [cat.rSpeed, -1 * cat.rSpeed])
      } else {
        cat.pos[0] = rng(pad.x, [-1, 1], [170, 10])
        cat.pos[1] = rng(pad.y, [-1, 1], [170, 10])
      }
      if (pad.ts !== cat.ts) cat.ts = pad.ts
      break

    default:
      dbg(cat.mode)
      break
  }

  if (cat.hardware === true) {
    // if (cat.pos[1] !== cat.prevPos[1] && cat.pos[0] !== cat.prevPos[0]) {
      // dbg('dif')
    cat.bot.x.to(cat.pos[0])
    cat.bot.y.to(cat.pos[1])
    cat.prevPos = cat.pos
    // }
  }
  if (cat.isRunning === true) {
    requestAnimationFrame(frame)
  }
}

const board = new five.Board()

board.on('ready', function () {
  const servox = new five.Servo({pin: 10, startAt: 90, range: [10, 170]})
  const servoy = new five.Servo({pin: 11, startAt: 90, range: [10, 170]})
  const laser = new five.Led(12)

  cat.hardware = true
  cat.bot.x = servox
  cat.bot.y = servoy
  cat.bot.l = laser
})

function padConCb () {
  dbg('con cb called')
  cat.gamePad = true
  cat.mode = 'gamePad'
  cat.isRunning = true
  requestAnimationFrame(frame)
}
function padDecoCb () {
  cat.gamePad = false
  cat.mode = 'mouse'
  cat.isRunning = false
}

if (canGame()) {
  console.log('game Api is supported yay')
  gPSetup(padConCb, padDecoCb)
}

function gPSetup (conCB, decoCB) {
  window.addEventListener('gamepadconnected', function () {
    console.log('connection event')
    if (conCB) conCB()
  })

  window.addEventListener('gamepaddisconnected', function () {
    console.log('disconnection event')
    if (decoCB) decoCB()
  })
}

function getMousePos (evt) {
  if (cat.window.x) cat.window = getWinInfo()
  return {
    x: rng(evt.clientX, [0, cat.window.x], [-1, 1]),
    y: rng(evt.clientY, [cat.window.y, 0], [-1, 1])
  }
}

window.onresize = resize

function resize () {
  cat.window = getWinInfo()
  dbg('rsz called')
}

function mouseSetup (canvas) {
  cat.window = getWinInfo()
  window.addEventListener('click', function (evt) {
    console.log(evt)
    cat.bot.l.toggle()
  })
  window.addEventListener('mousemove', function (evt) {
    const mousePos = getMousePos(evt)
    cat.pos[0] = rng(mousePos.x, [-1, 1], [160, 20])
    cat.pos[1] = rng(mousePos.y, [-1, 1], [160, 20])
    console.log(cat.pos)
  }, false)
  cat.isRunning = true
  requestAnimationFrame(frame)
}

function getWinInfo () {
  const width = window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth

  const height = window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight
  return {
    x: width,
    y: height
  }
}

// function kbSetup (canvas) {
//   console.log('setup keyboard')
//   canvas.addEventListener('click', canvaClick, false)
// }

// function canvaClick (e) {
//   console.log('clicked')
//   const x = e.offsetX < 150 ? e.offsetX : 150
//   const y = e.offsetY < 150 ? e.offsetY : 150
//   const pad = {
//     x: rng(x, [0, 150], [-1, 1]),
//     y: rng(y, [0, 150], [1, -1])
//   }
//   canKey.draw(pad, stickACanvas)
// }

mouseSetup()
// kbSetup(stickACanvas)

canKey.draw({x: 0, y: 0}, stickACanvas)
