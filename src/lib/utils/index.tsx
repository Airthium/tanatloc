/** @module Lib.Utils */

import { Avatar, Spin, Tooltip } from 'antd'
import { parseOneAddress } from 'email-addresses'

/**
 * String to color
 * @param {string} str String
 * @returns {string} HSL color
 */
const stringToColor = (str?: string): string => {
  if (!str) return '#FFFFFF'

  const stringHash = Array.from(str).reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)

  return 'hsl(' + (stringHash % 360) + ', 100%, 25%)'
}

/**
 * Component to Hex
 * @param {number} c Color
 * @returns {string} Hex
 */
const componentToHex = (c: number): string => {
  const hex = c.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

/**
 * RGB to Hex
 * @param {Object} color Color `{r, g, b}`
 * @returns {string} Hex
 */
const rgbToHex = (color: { r: number; g: number; b: number }): string => {
  return (
    '#' +
    componentToHex(color.r * 255) +
    componentToHex(color.g * 255) +
    componentToHex(color.b * 255)
  )
}

/**
 * rgb to CSS rgba
 * @param {Object} color Color `{r, g, b}`
 * @param {number} alpha Alpha
 * @returns {string} rgba
 */
const rgbToRgba = (
  color?: { r: number; g: number; b: number },
  alpha: number = 1
): string => {
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
 * @param {Object} user User
 * @returns {jsx} Avatar
 */
const userToAvatar = (user: {
  id?: string
  email?: string
  firstname?: string
  lastname?: string
  avatar?: Buffer
}): JSX.Element => {
  const avatar = user.avatar && Buffer.from(user.avatar).toString()
  let name = ''
  let abbrev = ''
  if (user.firstname || user.lastname) {
    name = user.firstname ? user.firstname + ' ' : ''
    name += user.lastname || ''

    abbrev = user.firstname ? user.firstname[0] : ''
    abbrev += user.lastname ? user.lastname[0] : ''
  } else if (user.email) {
    name = user.email
    abbrev = user.email[0]
  }
  return (
    <Tooltip key={user.id || JSON.stringify(user)} title={name}>
      <Avatar src={avatar} style={{ backgroundColor: stringToColor(name) }}>
        {abbrev.toUpperCase() || <Spin />}
      </Avatar>
    </Tooltip>
  )
}

/**
 * Group to avatar
 * @param {Object} group Group
 * @returns {jsx} Avatar
 */
const groupToAvatar = (group: { id?: string; name?: string }): JSX.Element => {
  let name = group.name
  let abbrev = ''
  if (name) abbrev = name[0]
  return (
    <Tooltip key={group.id || JSON.stringify(group)} title={name}>
      <Avatar style={{ backgroundColor: stringToColor(name) }}>
        {abbrev.toUpperCase() || <Spin />}
      </Avatar>
    </Tooltip>
  )
}

/**
 * Validate email
 * @param {string} email Email
 * @returns {bool} Valid
 */
const validateEmail = (email: string): boolean => {
  return !!parseOneAddress(email)
}

/**
 * Get git version
 * @returns Git version
 */
const getGitVersion = (): string => {
  let gitVersion = ''
  if (
    process.env.NEXT_PUBLIC_SOURCE_BRANCH &&
    process.env.NEXT_PUBLIC_SOURCE_COMMIT
  )
    gitVersion =
      'git-' +
      process.env.NEXT_PUBLIC_SOURCE_BRANCH +
      '-' +
      process.env.NEXT_PUBLIC_SOURCE_COMMIT

  return gitVersion
}

const Utils = {
  stringToColor,
  rgbToHex,
  rgbToRgba,
  userToAvatar,
  groupToAvatar,
  validateEmail,
  getGitVersion
}
export default Utils
