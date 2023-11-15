/** @module API.Geometry */

import { useGeometries } from './useGeometries'
import { add } from './add'
import { update } from './update'
import { del } from './del'

import { download } from './download'
import { getPart } from './getPart'
import { splitStep } from './splitStep'

const Geometry = {
  useGeometries,
  add,
  update,
  del,
  download,
  getPart,
  splitStep
}
export default Geometry
