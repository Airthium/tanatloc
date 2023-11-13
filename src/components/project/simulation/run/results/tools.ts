/** @module Components.Project.Simulation.Run.Results.Tools */

import { ISimulationTaskFile } from '@/database/simulation/index'
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
    let regexps = []
    if (Array.isArray(filter!.pattern)) regexps = [...filter!.pattern]
    else regexps = [filter!.pattern]

    let number = file.fileName
    regexps.forEach((regexp) => (number = number.replace(regexp, '')))

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
): number | undefined => {
  const multiplicatorPath = filter!.multiplicator
  if (multiplicatorPath) {
    const multiplicatorObject = multiplicatorPath.reduce(
      (a: any, v) => a[v],
      configuration
    )
    return multiplicatorObject.value ?? multiplicatorObject.default
  }
  return undefined
}
