/** @namespace Lib.Utils */

import { Avatar, Spin, Tooltip } from 'antd'

/**
 * String to color
 * @memberof Lib.Utils
 * @param {string} str String
 * @returns {string} Color
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
 * @memberof Lib.Utils
 * @param {number} c Color
 * @returns {string} Hex
 */
const componentToHex = (c) => {
  const hex = c.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

/**
 * RGB to Hex
 * @memberof Lib.Utils
 * @param {Object} color Color {r, g, b}
 * @returns {string} Hex
 */
const rgbToHex = (color) => {
  return (
    '#' +
    componentToHex(color.r * 255) +
    componentToHex(color.g * 255) +
    componentToHex(color.b * 255)
  )
}

/**
 * rgb to CSS rgba
 * @memberof Lib.Utils
 * @param {Object} color Color {r, g, b}
 * @param {number} alpha Alpha
 * @returns {string} rgba
 */
const rgbToRgba = (color, alpha = 1) => {
  if (!color) return 'rgba(255, 255, 255, 0)'
  return (
    'rgba(' +
    color.r * 255 +
    ', ' +
    color.g * 255 +
    ', ' +
    color.b * 255 +
    ', ' +
    alpha +
    ')'
  )
}

/**
 * User to avatar
 * @memberof Lib.Utils
 * @param {Object} user User
 * @returns {jsx} Avatar
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

/**
 * Group to avatar
 * @memberof Lib.Utils
 * @param {Object} group Group
 * @returns {jsx} Avatar
 */
const groupToAvatar = (group) => {
  let name = group.name
  let abbrev = ''
  if (name) abbrev = name[0]
  return (
    <Tooltip key={group.id || group} title={name}>
      <Avatar style={{ backgroundColor: stringToColor(name) }}>
        {abbrev.toUpperCase() || <Spin />}
      </Avatar>
    </Tooltip>
  )
}

/**
 * Validate email
 * @memberof Lib.Utils
 * @param {string} email Email
 * @returns {bool} Valid
 */
const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email.toLowerCase())
}

const Utils = {
  stringToColor,
  rgbToHex,
  rgbToRgba,
  userToAvatar,
  groupToAvatar,
  validateEmail
}
export default Utils
