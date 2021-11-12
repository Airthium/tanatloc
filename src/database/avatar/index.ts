/** @namespace Database.Avatar */

export interface INewAvatar {
  id: string
  name: string
}

export interface IAvatar {
  id: string
  name?: string
  path?: string
}

import { add } from './add'
import { get } from './get'
import { del } from './del'

export default { add, get, del }
