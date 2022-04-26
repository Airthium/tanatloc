/** @module Database.Simulation.Get */

import { IModel } from '@/models/index.d'

import { tables } from '@/config/db'

import { getter } from '..'

export type TSimulationGet = ('name' | 'scheme' | 'tasks' | 'project')[]

export interface ISimulationTaskFile {
  fileName: string
  originPath: string
  type: string
  name?: string
  renderPath?: string
  glb?: string
  json?: string
  number?: number
}

export interface ISimulationTask {
  index: number
  label: string
  status: 'wait' | 'process' | 'finish' | 'error'
  pid?: string | number
  log?: string
  pluginLog?: string
  warning?: string
  error?: string
  systemLog?: string
  link?: {
    label: string
    href: string
  }
  file?: ISimulationTaskFile
  files?: ISimulationTaskFile[]
  plugin?: string
  datas?: Array<{ x: number; y: number }>
}

export type TSimulationGetName = 'name'[]
export type TSimulationGetScheme = 'scheme'[]
export type TSimulationGetTasks = 'tasks'[]
export type TSimulationGetProject = 'project'[]

export interface ISimulation<T = []> {
  id: string
  name: TSimulationGetName extends T ? string : never
  scheme: TSimulationGetScheme extends T ? IModel : never
  tasks?: TSimulationGetTasks extends T ? ISimulationTask[] : never[]
  project: TSimulationGetProject extends T ? string : never
}

/**
 * Get
 * @param id Id
 * @param data Data
 * @returns Simulation
 */
export const get = async <T extends TSimulationGet>(
  id: string,
  data: T
): Promise<ISimulation<T>> => {
  const response = await getter(tables.SIMULATIONS, id, data)

  const simulation = response.rows[0]
  simulation && (simulation.id = id)

  return simulation
}
