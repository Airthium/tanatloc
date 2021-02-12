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

const componentToHex = (c) => {
  const hex = c.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

const rgbToHex = (color) => {
  return (
    '#' +
    componentToHex(color[0] * 255) +
    componentToHex(color[1] * 255) +
    componentToHex(color[2] * 255)
  )
}

export default { stringToColor, rgbToHex }
