/** @module Database.Organization */

import { INewOrganization, add } from './add'
import { getAll } from './getAll'
import { TOrganizationGet, IOrganization, get } from './get'
import { update } from './update'
import { del } from './del'

const Organization = { add, getAll, get, update, del }
export type { INewOrganization, IOrganization, TOrganizationGet }
export default Organization
