import path from 'path'
import fs from 'fs'
import archiver from 'archiver'

import storage from '@/config/storage'

import Tools from '@/lib/tools'

const createArchiveStream = async (simulation) => {
  const resultPath = path.join(
    storage.SIMULATION,
    simulation.id,
    'run',
    'result'
  )
  const archiveName = path.join(
    storage.SIMULATION,
    simulation.id,
    'run',
    'archive.tar.gz'
  )

  // Get result files
  const filesDirents = await Tools.listFiles(resultPath)
  const files = filesDirents
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name)

  // Create zip
  const output = fs.createWriteStream(archiveName)
  const archive = archiver('tar')

  await new Promise(async (resolve, reject) => {
    archive.on('warning', (err) => console.warn(err))
    archive.on('error', (err) => reject(err))
    archive.pipe(output)

    // Append files
    files.forEach((file) => {
      archive.file(path.join(resultPath, file), {
        name: path.join('result', file)
      })
    })

    output.on('close', resolve)

    // Finalize
    await archive.finalize()
  })

  // Read stream
  const readStream = createReadStream(simulation, {
    originPath: 'run',
    fileName: 'archive.tar.gz'
  })

  return readStream
}

const createReadStream = (simulation, file) => {
  const readStream = fs.createReadStream(
    path.join(storage.SIMULATION, simulation.id, file.originPath, file.fileName)
  )
  return readStream
}

export default { createArchiveStream, createReadStream }
