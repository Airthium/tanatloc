/** @module lib/utils */

import { Avatar, Spin, Tooltip } from 'antd'

/**
 * String to color
 * @param {string} str String
 */
const stringToColor = (str) => {
  if (!str) return '#FFFFFF'

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

/**
 * User to avatar
 * @param {Object} user User
 */
const userToAvatar = (user) => {
  const avatar = user.avatar && Buffer.from(user.avatar).toString()
  let name = ''
  let abbrev = ''
  if (user.firstname || user.lastname) {
    name = user.firstname + ' ' + user.lastname
    abbrev =
      (user.firstname && user.firstname[0]) +
      (user.lastname && user.lastname[0])
  } else if (user.email) {
    name = user.email
    abbrev = user.email[0]
  }
  return (
    <Tooltip key={user.id || user} title={name}>
      <Avatar src={avatar} style={{ backgroundColor: stringToColor(name) }}>
        {abbrev.toUpperCase() || <Spin />}
      </Avatar>
    </Tooltip>
  )
}

export default { stringToColor, rgbToHex, rgbToRgba, userToAvatar }
