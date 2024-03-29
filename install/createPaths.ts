/** @module Install.CreatePaths */

import { promises as fs } from 'fs'

import { STORAGE, AVATAR, GEOMETRY, SIMULATION } from '@/config/storage'

/**
 * Create paths from config
 */
export const createPaths = async (): Promise<void> => {
  console.info(' == Create paths == ')

  console.info(' + STORAGE: ' + STORAGE)
  await createPath(STORAGE)

  console.info(' + AVATAR: ' + AVATAR)
  await createPath(AVATAR)

  console.info(' + GEOMETRY: ' + GEOMETRY)
  await createPath(GEOMETRY)

  console.info(' + SIMULATION: ' + SIMULATION)
  await createPath(SIMULATION)
}

/**
 * Create a path
 * @param path Path
 */
const createPath = async (path: string): Promise<void> => {
  try {
    await fs.mkdir(path)
  } catch (err: any) {
    if (err.code === 'EEXIST') {
      console.warn(' ⚠ ' + path + ' directory already exists')
    } else {
      console.error(' ⚠ Unable to create ' + path)
      throw err
    }
  }
}
