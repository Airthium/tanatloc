/** @module API.Simulation */

import { useSimulations } from './useSimulations'
import { useSimulation } from './useSimulation'
import { add } from './add'
import { update } from './update'
import { del } from './del'
import { run } from './run'
import { stop } from './stop'
import { tasks } from './tasks'
import { log } from './log'
import { copy } from './copy'

const Simulation = {
  useSimulations,
  useSimulation,
  add,
  update,
  del,
  run,
  stop,
  tasks,
  log,
  copy
}

export default Simulation
