/* all about gamepad */
const dbg = require('debug')('catbot:gPad')
/**
 * check availability of the gampad api
 *
 * @returns {boolean} is game pad api available
 */
function canGame () {
  return 'getGamepads' in navigator
}

/**
 * pools the gamepad an return an object containing the 2 axes and the status of button A (pressed)
 *
 * @returns
 */
function poolGp () {
  const pad = navigator.getGamepads()[0] // only scan for the forst gp
  const padData = {
    x: pad.axes[0],
    y: pad.axes[1],
    a: pad.buttons[0].pressed,
    ts: pad.timestamp
  }
  return padData
}

/**
 * setup of the gamepad listerners when a pad connect disconnect
 *
 * @param {function} conCB callback on gampad connect
 * @param {function} decoCB callback on gampad disconnect
 */
function makeLaserPad (conCB, decoCB) {
  window.addEventListener('gamepadconnected', function () {
    dbg('connection event')
    if (conCB) conCB()
  })

  window.addEventListener('gamepaddisconnected', function () {
    dbg('disconnection event')
    if (decoCB) decoCB()
  })
}

module.exports = {
  canGame,
  poolGp,
  makeLaserPad
}
