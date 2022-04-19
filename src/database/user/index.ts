/** @module Database.User */

import { INewUser, add } from './add'
import { TUserGet, IUser, get } from './get'
import { getAll } from './getAll'
import {
  IUserCheck,
  getByUsernameAndPassword
} from './getByUsernameAndPassword'
import { update } from './update'
import { del } from './del'

const User = { add, get, getAll, getByUsernameAndPassword, update, del }
export type { INewUser, IUserCheck, IUser, TUserGet }
export default User
