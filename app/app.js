/* global requestAnimationFrame */
'use strict'

const h = require('hyperscript')
const controlView = require('./views/control')

const Gpad = require('./gamePad')
var five = require('johnny-five')

const canKey = require('./drawKeyboardCanvas')

const canLib = require('./drawGamepadCanvas')
const canGame = Gpad.canGame
const poolGp = Gpad.poolGp
const makeLaserPad = Gpad.makeLaserPad

const u = require('./utils')
const rng = u.convertRange // range converter

// cat config vars (TODO: make them separated ?)
const rSpeed = 3 // degree per cycle in relative mode

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


// const bases = h('.wrapper', {},
//   h('#gamepadPrompt', prmpt),
//   h('#catStatus'),
//   h('canvas#axe1', {width: 400, height: 400}),
//   h('#padInfoCont', h('#pad0'))
// )

document.body.appendChild(controlView)
// const padInfo = document.getElementById('padInfoCont')
const stickACanvas = document.getElementById('axe1')

const cat = {
  forceKb: false, // dev mode
  ts: -1,
  mode: 'keyboard',
  gamePad: false,
  isRunning: false,
  hardware: false,
  bot: {},
  isLaserOn: false,
  isRealtive: true,
  pad: {
    isBtActive: false,
    prevState: {}
  },
  pos: [90, 90]
}

function frame (timestamp) {
  let pad = {}

  // not sure if this is the right way to implement the frame (check game mode each frame is probably sub optimal)
  if (cat.forceKb === true) {
    console.log('yo')
  } else if (cat.gamePad) {
    pad = poolGp()
    canLib.draw(pad, stickACanvas)
    if (pad.a === true && cat.pad.isBtActive === false) {
      console.log('A dwn')
      cat.pad.isBtActive = true
    } else if (pad.a === false && cat.pad.isBtActive === true) {
      console.log('A rlz')
      if (cat.hardware === true) {
        cat.isLaserOn === true ? cat.bot.l.off() : cat.bot.l.on()
        cat.isLaserOn = !cat.isLaserOn
      }
      cat.pad.isBtActive = false
    }
    if (pad.ts !== cat.ts) cat.ts = pad.ts
  }
  if (cat.hardware === true) {
    let x
    let y

    if (cat.isRealtive) {
      x = rng(pad.x, [-1, 1], [rSpeed, -1 * rSpeed])
      y = rng(pad.y, [-1, 1], [rSpeed, -1 * rSpeed])
      cat.pos[0] = cat.pos[0] + x
      cat.pos[1] = cat.pos[1] + y
    } else {
      cat.pos[0] = rng(pad.x, [-1, 1], [180, 0])
      cat.pos[1] = rng(pad.y, [-1, 1], [180, 0])
    }
    cat.pos.forEach(function (pos, i) {
      console.log(pos, i)
      if (pos > 170) cat.pos[i] = 170
      if (pos < 10) cat.pos[i] = 10
      console.log(pos, i)
      return pos
    })
    console.log(cat.pos)
    cat.bot.x.to(cat.pos[0])
    cat.bot.y.to(cat.pos[1])
  }
  if (cat.isRunning === true) {
    requestAnimationFrame(frame)
  }
}

const board = new five.Board()

board.on('ready', function () {
  const servoy = new five.Servo({pin: 10, startAt: 90, range: [10, 170]})
  const servox = new five.Servo({pin: 9, startAt: 90, range: [10, 170]})
  const laser = new five.Led(12)

  cat.hardware = true
  cat.bot.x = servox
  cat.bot.y = servoy
  cat.bot.l = laser
})

if (canGame()) {
  console.log('game Api is supported yay')
  makeLaserPad(() => {
    cat.gamePad = true
    cat.isRunning = true
    requestAnimationFrame(frame)
  }, () => {
    cat.gamePad = false
    cat.isRunning = false
  })
}

function getMousePos (rect, evt) {
  const pos = {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  }
  console.log(pos)
  pos.x = rng(pos.x, [0, rect.width], [-1, 1])
  pos.y = rng(pos.y, [rect.height, 0], [-1, 1])
  return pos
}


function mouseSetup (canvas) {
  canvas.addEventListener('mousemove', function (evt) {
    const rect = canvas.getBoundingClientRect()
    let mousePos = getMousePos(rect, evt)
    let message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
    console.log(message)
  }, false)
}

function kbSetup (canvas) {
  console.log('setup keyboard')
  canvas.addEventListener('click', canvaClick, false)
}

function canvaClick (e) {
  console.log('clicked')
  const x = e.offsetX < 150 ? e.offsetX : 150
  const y = e.offsetY < 150 ? e.offsetY : 150
  const pad = {
    x: rng(x, [0, 150], [-1, 1]),
    y: rng(y, [0, 150], [1, -1])
  }
  canKey.draw(pad, stickACanvas)
}

mouseSetup(stickACanvas)
// kbSetup(stickACanvas)

canKey.draw({x: 0, y: 0}, stickACanvas)
