/**
 * convert value from a range to another
 *
 * @param {int} value to convert
 * @param {array} r1 range of the initial value
 * @param {array} r2 desired range scale
 * @returns {int} value converted to the desired scale in the dest range
 */
function convertRange (value, r1, r2) {
  return (value - r1[ 0 ]) * (r2[ 1 ] - r2[ 0 ]) / (r1[ 1 ] - r1[ 0 ]) + r2[ 0 ]
}

module.exports = {
  convertRange
}
