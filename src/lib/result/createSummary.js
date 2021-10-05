import path from 'path'
import fs from 'fs'

import storage from '@/config/storage'

/**
 * Create summary
 * @memberof Lib.Result
 * @param {Object} simulation Simulation
 * @returns {Object} Summary `{ name, path }`
 */
const createSummary = (simulation) => {
  // Name
  const summaryName = 'summary.txt'

  const summaryPath = path.join(
    storage.SIMULATION,
    simulation.id,
    'run',
    summaryName
  )

  // Stream
  const summary = fs.createWriteStream(summaryPath)

  // Header
  summary.write(simulation.name + '\n')
  summary.write('algorithm: ' + simulation.scheme.algorithm + '\n\n')

  // Keys
  Object.keys(simulation.scheme.configuration).forEach((key) => {
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
 * @param {Object} stream Write stream
 * @param {Object} configuration Configuration
 */
const geometrySummary = (stream, configuration) => {
  stream.write('Geometry:\n')
  stream.write(' - ' + configuration.value + '\n\n')
}

/**
 * Materials summary
 * @memberof Lib.Result
 * @param {Object} stream Write stream
 * @param {Object} configuration Configuration
 */
const materialsSummary = (stream, configuration) => {
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
 * @param {Object} stream Write stream
 * @param {Object} configuration Configuration
 */
const parametersSummary = (stream, configuration) => {
  stream.write('Parameters:\n')
  Object.keys(configuration).forEach((subKey) => {
    if (subKey === 'index' || subKey === 'title' || subKey === 'done') return

    const subConfiguration = configuration[subKey]

    stream.write('- ' + subConfiguration.label + ':\n')
    subConfiguration.children.forEach((child) => {
      stream.write(
        '  - ' + child.label + ': ' + (child.value || child.default) + '\n'
      )
    })
  })
  stream.write('\n')
}

/**
 * Boundary conditions summary
 * @memberof Lib.Result
 * @param {Object} stream Write stream
 * @param {Object} configuration Configuration
 */
const boundaryConditionsSummary = (stream, configuration) => {
  stream.write('Boundary conditions:\n')
  Object.keys(configuration).forEach((subKey) => {
    if (subKey === 'index' || subKey === 'title' || subKey === 'done') return

    const subConfiguration = configuration[subKey]

    if (subConfiguration.values) {
      subConfiguration.values.forEach((value) => {
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
      })
    }
  })
  stream.write('\n')
}

/**
 * Run
 * @memberof Lib.Result
 * @param {Object} stream Write stream
 * @param {Object} configuration Configuration
 */
const runSummary = (stream, configuration) => {
  stream.write('Run:\n')
  stream.write(' - Server: ' + configuration.cloudServer.name + '\n\n')
}

export default createSummary
