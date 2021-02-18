/** @module src/lib/utils */

/**
 * String to color
 * @param {string} str String
 */
const stringToColor = (str) => {
  str = str.replace(/[\W_]+/g, '')

  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase()
  return '#' + '00000'.substring(0, 6 - c.length) + c
}

/**
 * Component to Hex
 * @param {number} c Color
 */
const componentToHex = (c) => {
  const hex = c.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

/**
 * RGB to Hex
 * @param {Array} color Color [r, g, b]
 */
const rgbToHex = (color) => {
  return (
    '#' +
    componentToHex(color[0] * 255) +
    componentToHex(color[1] * 255) +
    componentToHex(color[2] * 255)
  )
}

/**
 * rgb to CSS rgba
 * @param {Array} color Color [r, g, b]
 * @param {number} alpha Alpha
 */
const rgbToRgba = (color, alpha = 1) => {
  if (!color) return 'rgba(255, 255, 255, 0)'
  return (
    'rgba(' +
    color[0] * 255 +
    ', ' +
    color[1] * 255 +
    ', ' +
    color[2] * 255 +
    ', ' +
    alpha +
    ')'
  )
}

export default { stringToColor, rgbToHex, rgbToRgba }
