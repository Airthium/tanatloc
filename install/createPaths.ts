import { promises as fs } from 'fs'

import * as config from '@/config/storage'

/**
 * Create paths from config
 * @memberof Install
 */
export const createPaths = async (): Promise<void> => {
  console.info(' == Create paths == ')

  for (const key of Object.keys(config)) {
    const path = config[key]
    console.info(' + ' + key + ': ' + path)
    await createPath(path)
  }
}

/**
 * Create a path
 * @memberof Install
 * @param path Path
 */
const createPath = async (path: string): Promise<void> => {
  try {
    await fs.mkdir(path)
  } catch (err) {
    if (err.code === 'EEXIST') {
      console.warn(' ⚠ ' + path + ' directory already exists')
    } else {
      console.error(' ⚠ Unable to create ' + path)
    }
  }
}
