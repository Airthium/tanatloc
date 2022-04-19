/** @module Database.Workspace */

import { INewWorkspace, add } from './add'
import { TWorkspaceGet, IWorkspace, get } from './get'
import { update } from './update'
import { del } from './del'

const Workspace = { add, get, update, del }
export type { INewWorkspace, IWorkspace, TWorkspaceGet }
export default Workspace
