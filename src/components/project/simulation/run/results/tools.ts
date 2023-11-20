/** @module Components.Project.Simulation.Run.Results.Tools */

import { ISimulationTaskFile } from '@/database/simulation/index'
import { IModel } from '@/models/index.d'

/**
 * Separate files
 * @param files Files
 * @param filter FIlter
 * @returns Files
 */
export const separateFiles = (
  files: ISimulationTaskFile[],
  filter: IModel['configuration']['run']['resultsFilter']
): {
  notFilteredFiles: ISimulationTaskFile[]
  filteredFiles: ISimulationTaskFile[]
} => {
  if (!filter) return { notFilteredFiles: [], filteredFiles: [] }

  // Pattern filter
  let patterns: RegExp[] = []
  if (Array.isArray(filter.pattern))
    patterns = filter.pattern.map((pattern) => new RegExp(pattern))
  else patterns = [new RegExp(filter.pattern)]

  const filteredFiles: ISimulationTaskFile[] = []
  const notFilteredFiles: ISimulationTaskFile[] = []

  files.forEach((file) => {
    const res = patterns.map((pattern) => pattern.test(file.fileName))
    const sum = res.reduce((accumulator, currentValue) => {
      return +accumulator + +currentValue
    }, 0)

    if (sum === 0) notFilteredFiles.push(file)
    else filteredFiles.push(file)
  })

  return {
    notFilteredFiles,
    filteredFiles
  }
}

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
  let preffixPatterns: RegExp[] = []
  if (Array.isArray(filter!.prefixPattern))
    preffixPatterns = filter!.prefixPattern.map(
      (pattern) => new RegExp(pattern)
    )
  else preffixPatterns = [new RegExp(filter!.prefixPattern)]

  let suffixPatterns: RegExp[] = []
  if (Array.isArray(filter!.suffixPattern))
    suffixPatterns = filter!.suffixPattern.map((pattern) => new RegExp(pattern))
  else suffixPatterns = [new RegExp(filter!.suffixPattern)]

  return files.map((file) => {
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

/**
 * Get min max
 * @param files Files
 * @returns min, max
 */
export const getMinMax = (
  files: (ISimulationTaskFile & { number: number })[]
): { min: number; max: number } => {
  let min = Infinity
  let max = -Infinity

  files.forEach((file) => {
    min = Math.min(min, file.number)
    max = Math.max(max, file.number)
  })

  return { min, max }
}
