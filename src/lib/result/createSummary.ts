import path from 'path'
import { WriteStream } from 'fs'

import { SIMULATION } from '@/config/storage'

import { IModel } from '@/models/index.d'

import Tools from '../tools'

/**
 * Create summary
 * @memberof Lib.Result
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
  simulation.scheme?.configuration &&
    Object.keys(simulation.scheme?.configuration).forEach((key) => {
      const config = simulation.scheme.configuration[key]

      if (key === 'geometry') {
        geometrySummary(summary, config)
      } else if (key === 'materials') {
        materialsSummary(summary, config)
      } else if (key === 'parameters') {
        parametersSummary(summary, config)
      } else if (key === 'boundaryConditions') {
        boundaryConditionsSummary(summary, config)
      } else if (key === 'run') {
        runSummary(summary, config)
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
 * @memberof Lib.Result
 * @param stream Write stream
 * @param configuration Configuration
 */
const geometrySummary = (
  stream: WriteStream,
  configuration: { value: string }
) => {
  stream.write('Geometry:\n')
  stream.write(' - ' + configuration.value + '\n\n')
}

/**
 * Materials summary
 * @memberof Lib.Result
 * @param stream Write stream
 * @param configuration Configuration
 */
const materialsSummary = (
  stream: WriteStream,
  configuration: {
    values: {
      material: {
        label: string
        children: { label: string; symbol: string; value: string }[]
      }
      selected: { label: string }[]
    }[]
  }
) => {
  stream.write('Materials:\n')
  configuration.values.forEach((value) => {
    stream.write(' - ' + value.material.label + ':\n')
    value.material.children.forEach((child) => {
      stream.write(
        '  - ' + child.label + ', ' + child.symbol + ' = ' + child.value + '\n'
      )
    })
    stream.write('  - Selected: [')
    stream.write(value.selected.map((select) => select.label).join(', '))
    stream.write(']\n')
  })
  stream.write('\n')
}

/**
 * Parameters summary
 * @memberof Lib.Result
 * @param stream Write stream
 * @param configuration Configuration
 */
const parametersSummary = (stream: WriteStream, configuration: {}) => {
  stream.write('Parameters:\n')
  Object.keys(configuration).forEach((subKey) => {
    if (subKey === 'index' || subKey === 'title' || subKey === 'done') return

    const subConfiguration = configuration[subKey]

    stream.write('- ' + subConfiguration.label + ':\n')
    subConfiguration.children.forEach(
      (child: { label: string; value: string; default: string }) => {
        stream.write(
          '  - ' + child.label + ': ' + (child.value || child.default) + '\n'
        )
      }
    )
  })
  stream.write('\n')
}

/**
 * Boundary conditions summary
 * @memberof Lib.Result
 * @param stream Write stream
 * @param configuration Configuration
 */
const boundaryConditionsSummary = (stream: WriteStream, configuration: {}) => {
  stream.write('Boundary conditions:\n')
  Object.keys(configuration).forEach((subKey) => {
    if (subKey === 'index' || subKey === 'title' || subKey === 'done') return

    const subConfiguration = configuration[subKey]

    if (subConfiguration.values) {
      subConfiguration.values.forEach(
        (value: {
          name: string
          type: { label: string }
          values: {
            checked: boolean
            value: string
          }[]
          selected: { label: string }[]
        }) => {
          stream.write(' - ' + value.name + ' (' + value.type.label + '):\n')

          if (value.values)
            value.values.forEach((subValue) => {
              stream.write('  - ' + subValue.value)

              if (subValue.checked !== undefined)
                stream.write(
                  ' (' + (subValue.checked ? 'active' : 'unactive') + ')'
                )

              stream.write('\n')
            })

          stream.write('  - Selected: [')
          stream.write(value.selected.map((select) => select.label).join(', '))
          stream.write(']\n')
        }
      )
    }
  })
  stream.write('\n')
}

/**
 * Run
 * @memberof Lib.Result
 * @param stream Write stream
 * @param configuration Configuration
 */
const runSummary = (
  stream: WriteStream,
  configuration: { cloudServer: { name: string } }
) => {
  stream.write('Run:\n')
  stream.write(' - Server: ' + configuration.cloudServer.name + '\n\n')
}

export default createSummary
