/** @module API.Geometry */

import { useGeometries } from './useGeometries'
import { add } from './add'
import { update } from './update'
import { del } from './del'

import { download } from './download'
import { getPart } from './getPart'

const Geometry = { useGeometries, add, update, del, download, getPart }
export default Geometry
