/** @module Database.Group */

import { INewGroup, add } from './add'
import { TGroupGet, IGroup, get } from './get'
import { getAll } from './getAll'
import { update } from './update'
import { del } from './del'

const Group = { add, get, getAll, update, del }
export type { INewGroup, IGroup, TGroupGet }
export default Group
