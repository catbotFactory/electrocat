const h = require('hyperscript')

const prmpt = 'mouse mode, mouve your mouse over the screen, clik to switch the laser on'

const controlView = h('.wrapper', {},
  h('#metaCont',
    h('#gamepadPrompt', prmpt),
    h('#catStatus')),
  h('canvas#axe1', {width: 400, height: 300}),
  h('#padInfoCont', h('#pad0'))
)

module.exports = controlView
