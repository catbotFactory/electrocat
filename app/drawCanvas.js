/* global Path2D */

const u = require('./utils')
const rng = u.convertRange
const markRadius = 5

function draw (pad, canvas) {
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  // mire (axe X)
  ctx.fillStyle = 'rgb(0,0,0)'
  ctx.rect(0, 0, 150, 150)
  ctx.stroke()
  const x = rng(pad.x, [-1, 1], [0, 150])
  const y = rng(pad.y, [-1, 1], [0, 150])
  ctx.fillStyle = 'rgb(200,0,0)'
  const mire = new Path2D()
  mire.arc(x, y, markRadius, 0, 360, false)
  ctx.fill(mire)

  const xRect = new Path2D()
  xRect.rect(0 + 160, 0, x, 20)
  xRect.moveTo(160, 0)
  ctx.fill(xRect)
  ctx.fillStyle = 'rgb(0,0,200)'
  const yRect = new Path2D()
  yRect.rect(0 + 160, 20, y, 20)
  yRect.moveTo(160, 0)
  ctx.fill(yRect)
  const btA = new Path2D()
  btA.rect(160, 40, 20, 20)
  if (pad.a === true) {
    ctx.fillStyle = 'rgb(0,200,0)'
  } else ctx.fillStyle = 'rgb(200,0,0)'
  ctx.fill(btA)
}

module.exports = {draw}
