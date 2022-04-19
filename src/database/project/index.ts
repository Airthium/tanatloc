/** @module Database.Project */

import { INewProject, add } from './add'
import { TProjectGet, IProject, get } from './get'
import { update } from './update'
import { del } from './del'

const Project = { get, add, update, del }
export type { INewProject, IProject, TProjectGet }
export default Project
