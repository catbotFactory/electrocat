'use strict'
const dbg = require('debug')('catbot:app')
const testBoard = require('./views/testBoard')
const testBoardView = testBoard.testBoardView
const updateCheck = testBoard.updateCheck
const h = require('hyperscript')

const mouse = require('./mouseControll')

dbg('testing for a board')

let checkCount = 0

var five = require('johnny-five')


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

document.body.appendChild(testBoardView)


function checkTimer () {
  return setInterval(function () {
    if (checkCount % 2 === 0) updateCheck('catStatus')
    else updateCheck('catStatus', ' ')
    console.log(checkCount)
    ++checkCount
    if (checkCount > 10) {
      updateCheck('catStatus', `can't find the catbot`)
      clearInterval(checkTmr)
      const firmata = require('firmata')
      // document.body.appendChild(h('a.trouble', {href: '/index'}, 'click here for troubleshooting'))
    }
  }, 1000)
}

let checkTmr = checkTimer()


const board = new five.Board()

board.on('ready', function () {
  clearInterval(checkTmr)
  updateCheck('catStatus', 'Catbot found !')
  const servox = new five.Servo({pin: 10, startAt: 90, range: [10, 170]})
  const servoy = new five.Servo({pin: 11, startAt: 90, range: [10, 170]})
  const laser = new five.Led(13)
  const cat = {
    x: servox,
    y: servoy,
    l: laser
  }
  mouse.init(cat)

})

window.onresize = resize

function resize () {
  dbg('rsz called')
}
