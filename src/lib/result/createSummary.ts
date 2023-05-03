/** @module Lib.Result.CreateSummary */

import path from 'path'
import { WriteStream } from 'fs'

import {
  IModel,
  IModelParameter,
  IModelTypedBoundaryCondition
} from '@/models/index.d'

import { SIMULATION } from '@/config/storage'

import Tools from '../tools'

/**
 * Create summary
 * @param simulation Simulation
 * @returns Summary
 */
const createSummary = (simulation: {
  id: string
  name?: string
  scheme?: IModel
}) => {
  // Name
  const summaryName = 'summary.txt'

  const summaryPath = path.join(SIMULATION, simulation.id, 'run', summaryName)

  // Stream
  const summary = Tools.writeStream(summaryPath)

  // Header
  summary.write(simulation.name + '\n')
  summary.write('algorithm: ' + simulation.scheme?.algorithm + '\n\n')

  // Keys
  const configuration = simulation.scheme?.configuration

  configuration &&
    Object.keys(configuration).forEach((key) => {
      const config = configuration[key as keyof typeof configuration]

      if (key === 'geometry') {
        geometrySummary(summary, config as IModel['configuration']['geometry'])
      } else if (key === 'materials') {
        materialsSummary(
          summary,
          config as IModel['configuration']['materials']
        )
      } else if (key === 'parameters') {
        parametersSummary(
          summary,
          config as IModel['configuration']['parameters']
        )
      } else if (key === 'boundaryConditions') {
        boundaryConditionsSummary(
          summary,
          config as IModel['configuration']['boundaryConditions']
        )
      } else if (key === 'run') {
        runSummary(summary, config as IModel['configuration']['run'])
      }
    })
  summary.end()

  return {
    name: summaryName,
    path: summaryPath
  }
}

/**
 * Geometry summary
 * @param stream Write stream
 * @param configuration Configuration
 */
const geometrySummary = (
  stream: WriteStream,
  configuration: IModel['configuration']['geometry']
) => {
  stream.write('Geometry:\n')
  stream.write(' - ' + configuration.value + '\n\n')
}

/**
 * Materials summary
 * @param stream Write stream
 * @param configuration Configuration
 */
const materialsSummary = (
  stream: WriteStream,
  configuration: IModel['configuration']['materials']
) => {
  if (!configuration) return

  stream.write('Materials:\n')
  configuration.values?.forEach((value) => {
    stream.write(' - ' + value.material.label + ':\n')
    value.material.children.forEach((child) => {
      stream.write(
        '  - ' + child.label + ', ' + child.symbol + ' = ' + child.value + '\n'
      )
    })

    stream.write('  - Geometry: ')
    stream.write(value.geometry)
    stream.write('\n')

    stream.write('  - Selected: [')
    stream.write(value.selected.map((select) => select.label).join(', '))
    stream.write(']\n')
  })
  stream.write('\n')
}

/**
 * Parameters summary
 * @param stream Write stream
 * @param configuration Configuration
 */
const parametersSummary = (
  stream: WriteStream,
  configuration: IModel['configuration']['parameters']
) => {
  stream.write('Parameters:\n')
  Object.keys(configuration).forEach((subKey) => {
    if (subKey === 'index' || subKey === 'title' || subKey === 'done') return

    const subConfiguration = configuration[
      subKey as keyof typeof configuration
    ] as {
      label: string
      advanced?: boolean
      children: IModelParameter[]
    }

    stream.write('- ' + subConfiguration.label + ':\n')
    subConfiguration.children.forEach((child) => {
      stream.write(
        '  - ' + child.label + ': ' + (child.value ?? child.default) + '\n'
      )
    })
  })
  stream.write('\n')
}

/**
 * Boundary conditions summary
 * @param stream Write stream
 * @param configuration Configuration
 */
const boundaryConditionsSummary = (
  stream: WriteStream,
  configuration: IModel['configuration']['boundaryConditions']
) => {
  stream.write('Boundary conditions:\n')
  Object.keys(configuration).forEach((subKey) => {
    if (subKey === 'index' || subKey === 'title' || subKey === 'done') return

    const subConfiguration = configuration[
      subKey
    ] as IModelTypedBoundaryCondition

    if (subConfiguration.values) {
      subConfiguration.values.forEach((value) => {
        stream.write(' - ' + value.name + ' (' + value.type.label + '):\n')

        value.values?.forEach((subValue) => {
          stream.write('  - ' + subValue.value)

          if (subValue.checked !== undefined)
            stream.write(
              ' (' + (subValue.checked ? 'active' : 'unactive') + ')'
            )

          stream.write('\n')
        })

        stream.write('  - Geometry: ')
        stream.write(value.geometry)
        stream.write('\n')

        stream.write('  - Selected: [')
        stream.write(value.selected.map((select) => select.label).join(', '))
        stream.write(']\n')
      })
    }
  })
  stream.write('\n')
}

/**
 * Run
 * @param stream Write stream
 * @param configuration Configuration
 */
const runSummary = (
  stream: WriteStream,
  configuration: IModel['configuration']['run']
) => {
  if (configuration.cloudServer) {
    stream.write('Run:\n')
    stream.write(' - Server: ' + configuration.cloudServer.name + '\n\n')
  }
}

export default createSummary
