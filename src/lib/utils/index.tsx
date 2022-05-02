/** @module Lib.Utils */

import { Avatar, Badge, Spin, Tooltip } from 'antd'
import { parseOneAddress } from 'email-addresses'

const deepCopy = <T extends {}>(object: T) => {
  return JSON.parse(JSON.stringify(object)) as T
}

/**
 * String to color
 * @param str String
 * @returns HSL color
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
 * @param c Color
 * @returns Hex
 */
const componentToHex = (c: number): string => {
  const hex = c.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

/**
 * RGB to Hex
 * @param color Color `{r, g, b}`
 * @returns Hex
 */
const rgbToHex = (color: { r: number; g: number; b: number }): string => {
  return (
    '#' +
    componentToHex(Math.floor(color.r * 255)) +
    componentToHex(Math.floor(color.g * 255)) +
    componentToHex(Math.floor(color.b * 255))
  )
}

/**
 * rgb to CSS rgba
 * @param color Color `{r, g, b}`
 * @param alpha Alpha
 * @returns rgba
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
 * @param user User
 * @returns Avatar
 */
const userToAvatar = (user: {
  id?: string
  pending?: boolean
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
    <Tooltip
      key={user.id || JSON.stringify(user)}
      title={name + (user.pending ? ' (Invite pending)' : '')}
    >
      <Badge
        count={user.pending && 'Pending...'}
        offset={[30, 5]}
        style={{ backgroundColor: '#ff4d4f', zIndex: 10 }}
      >
        <Avatar src={avatar} style={{ backgroundColor: stringToColor(name) }}>
          {abbrev.toUpperCase() || <Spin />}
        </Avatar>
      </Badge>
    </Tooltip>
  )
}

/**
 * Group to avatar
 * @param group Group
 * @returns Avatar
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
 * @param email Email
 * @returns Valid
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
  deepCopy,
  stringToColor,
  rgbToHex,
  rgbToRgba,
  userToAvatar,
  groupToAvatar,
  validateEmail,
  getGitVersion
}
export default Utils
