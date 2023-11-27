/** @module Plugins.Interface */

import { IModel } from '@/models/index.d'
import { ISimulation, ISimulationTask } from '@/database/simulation'

import { UpdateTasksHelper } from './local/src/lib'

/**
 * Plugin base
 */
export interface BasePlugin {
  key: string
  uuid?: string
  rootDirectory?: string
}

/**
 * HPC plugin
 */
export interface HPCPlugin extends BasePlugin {
  category: 'HPC'
  client: {
    name: string
    description: string
    haveInit?: true
    needReInit?: boolean
    configuration: {
      [key: string]: {
        label: string
        type: 'input' | 'textarea' | 'password' | 'select'
        secret?: boolean
        tooltip?: string
        rules?: {
          required?: boolean
          message?: string
          min?: number
          max?: number
        }[]
        options?: string[]
        default?: boolean | number | string
        value?: boolean | number | string
        props?: any
      }
    }
    inUseConfiguration?: {
      [key: string]: {
        label: string
        parallelOnly?: boolean
        value?: boolean | number | string
      }
    }
    extra?: {
      [key: string]: {
        type: 'button'
        label: string
        action: string
        icon: string
      }
    }
    data?: {
      [key: string]: any
    }
  }
  server: {
    lib: {
      init?: (
        configuration: HPCClientPlugin['configuration']
      ) => Promise<{ data: HPCClientPlugin['data'] } | void>
      computeSimulation: (
        { id }: { id: string },
        scheme: ISimulation<'scheme'[]>['scheme'],
        keepMesh?: boolean
      ) => Promise<void>
      monitoring: (
        id: string,
        pid: string | undefined,
        { tasks, currentTask }: UpdateTasksHelper,
        configuration?: HPCClientPlugin['configuration']
      ) => Promise<void>
      stop: (
        id: string,
        tasks: ISimulationTask[],
        configuration: IModel['configuration']
      ) => Promise<void>
      extra?: (
        simulation: { id: string },
        configuration: HPCClientPlugin['configuration'],
        extra: string
      ) => Promise<void>
    }
  }
}

/**
 * Model plugin
 */
export interface ModelPlugin extends BasePlugin {
  category: 'Model'
  client: {
    name: string
    models: IModel[]
  }
  server: {
    templates?: { key: string; file: string }[]
  }
}

/**
 * Generic plugin
 */
export type Plugin = HPCPlugin | ModelPlugin

/**
 * HPC server plugin
 */
export type HPCServerPlugin = BasePlugin &
  HPCPlugin['server'] & {
    category: 'HPC'
  }

/**
 * Model server plugin
 */
export type ModelServerPlugin = BasePlugin &
  ModelPlugin['server'] & {
    category: 'Model'
  }

/**
 * Generic server plugin
 */
export type ServerPlugin = HPCServerPlugin | ModelServerPlugin

/**
 * HPC client plugin
 */
export type HPCClientPlugin = BasePlugin &
  HPCPlugin['client'] & {
    category: 'HPC'
  }

/**
 * Model client plugin
 */
export type ModelClientPlugin = BasePlugin &
  ModelPlugin['client'] & {
    category: 'Model'
  }

/**
 * Generic client plugin
 */
export type ClientPlugin = HPCClientPlugin | ModelClientPlugin
