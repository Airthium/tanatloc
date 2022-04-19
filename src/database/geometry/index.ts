/** @module Database.Geometry */

import { INewGeometry, add } from './add'
import { TGeometryGet, IGeometry, get } from './get'
import { update } from './update'
import { del } from './del'

const Geometry = { add, get, update, del }
export type { INewGeometry, IGeometry, TGeometryGet }
export default Geometry
