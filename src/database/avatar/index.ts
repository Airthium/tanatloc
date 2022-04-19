/** @module Database.Avatar */

import { INewAvatar, add } from './add'
import { TAvatarGet, IAvatar, get } from './get'
import { del } from './del'

const Avatar = { add, get, del }
export type { INewAvatar, IAvatar, TAvatarGet }
export default Avatar
