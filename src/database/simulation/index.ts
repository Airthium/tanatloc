/** @module Database.Simulation */

import { INewSimulation, add } from './add'
import { TSimulationGet, ISimulation, get } from './get'
import { update } from './update'
import { del } from './del'
import { getAll } from './getAll'

const Simulation = { add, get, update, del, getAll }
export type { INewSimulation, ISimulation, TSimulationGet }
export default Simulation
