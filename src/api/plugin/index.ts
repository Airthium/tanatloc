/** @module API.Plugin */

import { add } from './add'
import { update } from './update'
import { del } from './del'
import { usePlugins } from './usePlugins'
import { extra } from './extra'

const Plugin = { add, update, del, usePlugins, extra }
export default Plugin
