const { color } = require('utils')

const LOG_LEVELS = new Map([
  ['ERROR', 'red'],
  ['WARNING', 'orange'],
  ['ALERT', 'yellow'],
  ['INFO', 'green'],
  ['DEBUG', 'gray']
])

function log (l, ...args) {
  const lvl = l.toUpperCase()

  if (LOG_LEVELS.has(lvl)) {
    console.log(`${color(lvl, LOG_LEVELS.get(lvl))}: ${args.join(' ')}`)
  }
}

module.exports = log
