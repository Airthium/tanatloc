/** @module Database.User */

import { add } from './add'
import { get } from './get'
import { getAll } from './getAll'
import { getByUsernameAndPassword } from './getByUsernameAndPassword'
import { update } from './update'
import { del } from './del'

const User = { add, get, getAll, getByUsernameAndPassword, update, del }
export default User
