import { promises as fs } from 'fs'

import config from '../config/storage'

/**
 * Create paths from config
 * @memberof module:install
 */
const createPaths = async () => {
  console.info(' == Create paths == ')

  for (const key of Object.keys(config)) {
    const path = config[key]
    console.info(' + ' + key + ': ' + path)
    await createPath(path)
  }
}

/**
 * Create a path
 * @memberof module:install
 * @param {string} path Path
 */
const createPath = async (path) => {
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

module.exports = createPaths
