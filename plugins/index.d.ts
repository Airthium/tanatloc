/** @module Plugins.Interface */

import { IModel } from '@/models/index.d'
import { ISimulation, ISimulationTask } from '@/database/simulation'

export interface IPlugin {
  uuid?: string
  key?: string
  category?: string
  haveInit?: boolean
  client?: {
    name?: string
    description?: string
    models?: IModel[]
    needInit?: boolean
    needReInit?: boolean
    configuration?: {
      [key: string]: {
        label: string
        type: string
        secret?: boolean
        tooltip?: string
        rules?: {
          required?: boolean
          message?: string
          max?: number
        }[]
        options?: string[]
        default?: boolean | number | string
        value?: boolean | number | string
        props?: any
      }
    }
    data?: {
      [key: string]: any
    }
    inUseConfiguration?: {
      [key: string]: {
        label: string
        value?: boolean | number | string
      }
    }
  }
  server?: {
    lib?: {
      init?: (
        configuration: IClientPlugin['configuration']
      ) => Promise<{ data: IClientPlugin['data'] }>
      computeSimulation: (
        { id }: { id: string },
        scheme: ISimulation['scheme']
      ) => Promise<void>
      monitoring: (
        id: string,
        pid: string | undefined,
        tasks: ISimulationTask[],
        simulationTask: ISimulationTask,
        configuration?: IClientPlugin['configuration']
      ) => Promise<void>
      stop: (
        id: string,
        tasks: ISimulationTask[],
        configuration: IModel['configuration']
      ) => Promise<void>
    }
    templates?: { key: string; file: string }[]
  }
}

export interface IServerPlugin extends Omit<IPlugin, 'client' | 'server'> {
  lib?: IPlugin['server']['lib']
  templates?: IPlugin['server']['templates']
}

export interface IClientPlugin extends Omit<IPlugin, 'client' | 'server'> {
  name?: IPlugin['client']['name']
  description?: IPlugin['client']['description']
  models?: IPlugin['client']['models']
  needInit?: IPlugin['client']['needInit']
  needReInit?: IPlugin['client']['needReInit']
  configuration?: IPlugin['client']['configuration']
  data?: IPlugin['client']['data']
  inUseConfiguration?: IPlugin['client']['inUseConfiguration']
}
