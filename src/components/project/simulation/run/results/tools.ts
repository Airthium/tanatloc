/** @module Components.Project.Simulation.Run.Results.Tools */

import { ISimulationTaskFile } from '@/database/index.d'
import { IModel } from '@/models/index.d'

/**
 * Get files numbers
 * @param files Files
 * @param filter Filter
 * @returns Files & number
 */
export const getFilesNumbers = (
  files: ISimulationTaskFile[],
  filter: IModel['configuration']['run']['resultsFilter']
): (ISimulationTaskFile & { number: number })[] => {
  return files.map((file) => {
    const number = file.fileName
      .replace(new RegExp(filter.prefixPattern), '')
      .replace(new RegExp(filter.suffixPattern), '')
    return {
      ...file,
      number: +number
    }
  })
}

/**
 * Get multiplicator
 * @param configuration Configuration
 * @param filter Filter
 * @returns Multiplicator
 */
export const getMultiplicator = (
  configuration: IModel['configuration'],
  filter: IModel['configuration']['run']['resultsFilter']
) => {
  const multiplicatorPath = filter.multiplicator
  if (multiplicatorPath) {
    const multiplicatorObject = multiplicatorPath.reduce(
      (a, v) => a[v],
      configuration
    )
    return multiplicatorObject.value ?? multiplicatorObject.default
  }
  return undefined
}
