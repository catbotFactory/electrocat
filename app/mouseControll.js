const u = require('./utils')
const rng = u.convertRange // range converter

function init (cat, cb) {
  console.log(window.innerWidth, window.innerHeight)
  const win = {x: window.innerWidth, y: window.innerHeight}
  window.addEventListener('mousemove', function (evt) {
    const X = rng(evt.clientX, [0, win.x], [-1, 1])
    const Y = rng(evt.clientY, [win.y, 0], [-1, 1])
    cat.pos = [X, Y]
    if (cb) cb()
  }, false)

  window.onClick = function (evt) {
    console.log('evt')
    console.log(evt)
  }
}

module.exports = {
  init
}
