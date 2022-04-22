/** @module Lib.Result.CreatePVD */

import path from 'path'

import { SIMULATION } from '@/config/storage'

import { ISimulation } from '@/database/simulation'

import Tools from '../tools'

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
    const pattern = new RegExp(filter.pattern)
    const filteredFiles = files.filter((file) => pattern.test(file))

    if (filteredFiles.length) {
      // Set iteration numbers
      const vtuFiles = filteredFiles.map((file) => {
        const number = file
          .replace(new RegExp(filter.prefixPattern), '')
          .replace(new RegExp(filter.suffixPattern), '')
        return {
          name: file,
          number: +number
        }
      })

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

        multiplicator = multiplicatorObject.value || multiplicatorObject.default
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
