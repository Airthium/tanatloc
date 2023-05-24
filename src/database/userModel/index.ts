/** @module Database.UserModel */

import { INewUserModel, add } from './add'
import { TUserModelGet, IUserModel, get } from './get'
import { update } from './udpate'
import { del } from './del'

const UserModel = { add, get, update, del }
export type { INewUserModel, IUserModel, TUserModelGet }
export default UserModel
