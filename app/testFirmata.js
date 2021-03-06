const SerialPort = require('serialport')
var Board = require('firmata')

const rport = /usb|acm|^com/i // taken from J5 code, thanks!

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

function listBoards (err, ports) {
  console.log('listing arduino boards')
  if (err) console.log(err)
  const boards = ports.filter(function (port) {
    // console.log(port, rport.test(port.comName))
    return rport.test(port.comName)
  })
  if (!boards.length) {
    console.log('no Board found')
    return false
  }
  testSerialCom(boards[0].comName)
}

function testSerialCom (portName) {
  console.log('serial:', portName)
  const board = new Board(portName)

  board.on('open', function () {
    let attempts = 0
    console.log('serial port is open, testing firmata ...')
    setInterval(function () {
      console.log('waiting for firmata ready event ...')
      if (attempts === 4) {
        console.log('can\'t communicate with firmata, please reflash the board')
        process.exit()
      }
      ++attempts
    }, 2000)
  })
  board.on('ready', function () {
    console.log('your board is ready to use !')
    process.exit()
  })
}

function testBoard () {
  SerialPort.list(listBoards)
}

// testBoard()
module.exports = testBoard
