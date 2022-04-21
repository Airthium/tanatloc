/** @module Database.Simulation */

import { INewSimulation, add } from './add'
import {
  TSimulationGet,
  ISimulationTaskFile,
  ISimulationTask,
  ISimulation,
  get
} from './get'
import { update } from './update'
import { del } from './del'
import { getAll } from './getAll'

const Simulation = { add, get, update, del, getAll }
export type {
  INewSimulation,
  ISimulationTaskFile,
  ISimulationTask,
  ISimulation,
  TSimulationGet
}
export default Simulation
