/* mouse.js; code for the mouse control mode */
const dbg = require('debug')('catbot:mouse')

const u = require('./utils')
const rng = u.convertRange // range converter

/**
 * get the mouse postion on the canvas and return a pos object with x and y normalised to -1 / 1
 *
 * @param {any} rect getBoundingClientRect object
 * @param {any} evt the mouse event
 * @returns
 */
function getMousePos (rect, evt) {
  const pos = {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  }
  dbg(pos)
  pos.x = rng(pos.x, [0, rect.width], [-1, 1])
  pos.y = rng(pos.y, [rect.height, 0], [-1, 1])
  return pos
}

function listeners (canvas) {
  canvas.addEventListener('mousemove', function (evt) {
    const rect = canvas.getBoundingClientRect()
    let mousePos = getMousePos(rect, evt)
    let message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y
    dbg(message)
  }, false)
}

module.exports = {
  listeners
}
