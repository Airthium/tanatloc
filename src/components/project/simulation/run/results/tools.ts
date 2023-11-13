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
    let preffixPatterns: RegExp[] = []
    if (Array.isArray(filter!.prefixPattern))
      preffixPatterns = filter!.prefixPattern.map(
        (pattern) => new RegExp(pattern)
      )
    else preffixPatterns = [new RegExp(filter!.prefixPattern)]

    let suffixPatterns: RegExp[] = []
    if (Array.isArray(filter!.suffixPattern))
      suffixPatterns = filter!.suffixPattern.map(
        (pattern) => new RegExp(pattern)
      )
    else suffixPatterns = [new RegExp(filter!.suffixPattern)]

    let number = file.fileName
    preffixPatterns.forEach((pattern) => (number = number.replace(pattern, '')))
    suffixPatterns.forEach((pattern) => (number = number.replace(pattern, '')))

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
