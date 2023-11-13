/** @module Lib.Result.CreatePVD */

import path from 'path'

import { IModel } from '@/models/index.d'
import { ISimulation } from '@/database/simulation'

import { SIMULATION } from '@/config/storage'

import Tools from '../tools'

/**
 * Separate files
 * @param files Files
 * @param filter FIlter
 * @returns Files
 */
export const separateFiles = (
  files: string[],
  filter: IModel['configuration']['run']['resultsFilter']
): {
  notFilteredFiles: string[]
  filteredFiles: string[]
} => {
  if (!filter) return { notFilteredFiles: [], filteredFiles: [] }

  // Pattern filter
  let patterns: RegExp[] = []
  if (Array.isArray(filter.pattern))
    patterns = filter.pattern.map((pattern) => new RegExp(pattern))
  else patterns = [new RegExp(filter.pattern)]

  const filteredFiles: string[] = []
  const notFilteredFiles: string[] = []

  files.forEach((file) => {
    const res = patterns.map((pattern) => pattern.test(file))
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
  files: string[],
  filter: IModel['configuration']['run']['resultsFilter']
): { name: string; number: number }[] => {
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
    let number = file
    preffixPatterns.forEach((pattern) => (number = number.replace(pattern, '')))
    suffixPatterns.forEach((pattern) => (number = number.replace(pattern, '')))

    return {
      name: file,
      number: +number
    }
  })
}

/**
 * Create PVD files
 * @param simulation Simulation
 * @param files Files
 * @returns PVDs
 */
const createPVD = (
  simulation: ISimulation<('name' | 'scheme')[]>,
  files: string[]
): { name: string; path: string }[] => {
  const PVDs: { name: string; path: string }[] = []

  // Results filter
  const configuration = simulation.scheme?.configuration
  if (!configuration) return PVDs

  const filter = configuration.run?.resultsFilter
  if (filter) {
    const { filteredFiles } = separateFiles(files, filter)

    if (filteredFiles.length) {
      // Set iteration numbers
      const vtuFiles = getFilesNumbers(filteredFiles, filter)

      // Sort
      vtuFiles.sort((a, b) => a.number - b.number)

      // Multiplicator
      let multiplicator: number

      const multiplicatorPath = filter.multiplicator
      if (multiplicatorPath) {
        const multiplicatorObject = multiplicatorPath.reduce(
          (a: any, v) => a[v],
          configuration
        ) as { value?: number; default: number }

        multiplicator = multiplicatorObject.value ?? multiplicatorObject.default
      }

      // PVD file
      const pvdName = filter.name + '.pvd'
      const pvdPath = path.join(
        SIMULATION,
        simulation.id,
        'run',
        filter.name + '.pvd'
      )
      const pvd = Tools.writeStream(pvdPath)
      pvd.write('<?xml version="1.0"?>\n')
      pvd.write('<VTKFile type="Collection" version="0.1"\n')
      pvd.write('\tbyte_order="LittleEndian"\n')
      pvd.write('\tcompressor="vtkZLibDataCompressor">\n')
      pvd.write('\t<Collection>\n')

      vtuFiles.forEach((file, index) => {
        pvd.write(
          '\t\t<DataSet timestep="' +
            (multiplicator ? file.number * multiplicator : index) +
            '" group="" part="0"\n'
        )
        pvd.write('\t\t\tfile="result/' + file.name + '"/>\n')
      })

      pvd.write('\t</Collection>\n')
      pvd.write('</VTKFile>')
      pvd.end()

      PVDs.push({
        name: pvdName,
        path: pvdPath
      })
    }
  }

  return PVDs
}

export default createPVD
