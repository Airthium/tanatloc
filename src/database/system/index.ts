/** @module Database.System */

import { TSystemGet, ISystem, get } from './get'
import { update } from './update'

const System = { get, update }
export type { ISystem, TSystemGet }
export default System
