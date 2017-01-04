const h = require('hyperscript')

const prmpt = 'Checking the catbot'

const testBoardView = h('.wrapper', {},
  h('#testBoardCont',
    h('#game  padPrompt', prmpt),
    h('#catStatus')),
  h('#statusCont'),
  h('#padInfoCont', h('#pad0'))
)

function updateCheck (target, text) {
  if (!text) text = 'looking for a catbot ...'
  const el = document.getElementById(target)
  el.innerHTML = text
}

module.exports = {
  testBoardView,
  updateCheck
}
