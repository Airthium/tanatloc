import path from 'path'
import fs from 'fs'

import storage from '@/config/storage'

/**
 * Create PVD files
 * @param {Object} simulation Simulation
 * @param {Array} files Files
 */
const createPVD = (simulation, files) => {
  const PVDs = []

  // Results filters
  const resultsFilters = simulation.scheme.configuration.run.resultsFilters
  resultsFilters?.forEach((filter) => {
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
      let multiplicator

      const multiplicatorPath = filter.multiplicator
      if (multiplicatorPath) {
        const multiplicatorObject = multiplicatorPath.reduce(
          (a, v) => a[v],
          simulation.scheme.configuration
        )

        multiplicator = multiplicatorObject.value || multiplicatorObject.default
      }

      // PVD file
      const pvdName = filter.name + '.pvd'
      const pvdPath = path.join(
        storage.SIMULATION,
        simulation.id,
        'run',
        filter.name + '.pvd'
      )
      const pvd = fs.createWriteStream(pvdPath)
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
  })

  return PVDs
}

export default createPVD
