/** @module API.Organization */

import { useOrganizations } from './useOrganizations'
import { add } from './add'
import { update } from './update'
import { del } from './del'

import { accept } from './accept'
import { decline } from './decline'
import { quit } from './quit'

const Organization = {
  useOrganizations,
  add,
  update,
  del,
  accept,
  decline,
  quit
}
export default Organization
