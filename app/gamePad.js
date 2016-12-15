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
 * set a dead zone on given input to avoir gamepad jitter
 *
 * @param {int} number valute to consider
 * @param {int} threshold of said angle
 * @returns {int} cleaned axe value
 */
function deadZone (number, threshold) {
  'use strict'
  let percentage = (Math.abs(number) - threshold) / (1 - threshold)
  if (percentage < 0) percentage = 0
  return percentage * (number > 0 ? 1 : -1)
}

/**
 * pools the gamepad an return an object containing the 2 axes and the status of button A (pressed)
 *
 * @returns {Object} pos object (x, y, a, timestamp (ts))
 */
function poolGp () {
  const pad = navigator.getGamepads()[0] // only scan for the forst gp

  const padData = {
    x: deadZone(pad.axes[0], 0.25),
    y: deadZone(pad.axes[1], 0.25),
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
