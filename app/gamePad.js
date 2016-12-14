const _ = require('lodash')
/**
 * check availability of the gampad api
 *
 * @returns {boolean} is game pad api available
 */
function canGame () {
  return 'getGamepads' in navigator
}

function poolGp (prevData) {
  const pad = navigator.getGamepads()[0]
  const padData = {
    x: pad.axes[0],
    y: pad.axes[1],
    a: pad.buttons[0].pressed,
    ts: pad.timestamp
  }
  return padData
}

function makeLaserPad (conCB, decoCB) {
  window.addEventListener('gamepadconnected', function () {
    console.log('connection event')
    if (conCB) conCB()
  })

  window.addEventListener('gamepaddisconnected', function () {
    console.log('disconnection event')
    if (decoCB) decoCB()
  })
}




module.exports = {
  canGame,
  poolGp,
  makeLaserPad
}
