/** @module API.User */

import { useUser } from './useUser'
import { useUsers } from './useUsers'
import { add } from './add'
import { update } from './update'
import { updateById } from './updateById'
import { del } from './del'
import { delById } from './delById'

import { check } from './check'

const User = {
  useUser,
  useUsers,
  add,
  update,
  updateById,
  del,
  delById,
  check
}

export default User
