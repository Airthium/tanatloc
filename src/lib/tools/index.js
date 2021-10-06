/** @namespace Lib.Tools */

import path from 'path'
import { promises as fs } from 'fs'
import ThreeToGLB from 'three-to-glb'

import Services from '@/services'

/**
 * Create path (recursive)
 * @memberof Lib.Tools
 * @param {string} location Location path
 */
const createPath = async (location) => {
  await fs.mkdir(location, { recursive: true })
}

/**
 * List files
 * @memberof Lib.Tools
 * @param {string} location Location
 * @returns {Object} Files list (with types)
 */
const listFiles = async (location) => {
  return fs.readdir(location, { withFileTypes: true })
}

const listDirectories = async (location) => {
  const files = await listFiles(location)
  return files
    .map((file) => {
      if (file.isDirectory()) return file.name
    })
    .filter((f) => f)
}

/**
 * Write file
 * @memberof Lib.Tools
 * @param {string} location Location
 * @param {string} name File name
 * @param {Object} content Content
 */
const writeFile = async (location, name, content) => {
  await createPath(location)
  await fs.writeFile(path.join(location, name), content)
}

/**
 * Read file
 * @memberof Lib.Tools
 * @param {string} file File name
 * @param {string} [type] Type (json)
 * @returns {string | Object} File content or JSON
 */
const readFile = async (file, type) => {
  const content = await fs.readFile(file)

  if (type === 'json') return JSON.parse(content.toString())
  return content
}

/**
 * Copy file
 * @memberof Lib.Tools
 * @param {string} origin Origin path
 * @param {string} destination Destination path
 */
const copyFile = async (origin, destination) => {
  await createPath(destination.path)
  await fs.copyFile(
    path.join(origin.path, origin.file),
    path.join(destination.path, destination.file)
  )
}

/**
 * Convert file
 * @memberof Lib.Tools
 * @param {string} location Location
 * @param {Object} file File `{ name, target }`
 * @param {Function} [callback] Callback
 * @param {Object} [param] Parameters `{ isResult: true }`
 * @returns {Object} Data `{ json, glb }`
 */
const convert = async (location, file, callback, param) => {
  const origin = file.name
  const jsonTarget = file.target
  const glbTarget = file.target + '.glb'

  const { code, data, error } = await Services.toThree(
    location,
    origin,
    jsonTarget
  )
  callback?.({ data, error })

  if (error) throw new Error('Conversion process failed.')
  if (code !== 0) throw new Error('Conversion process failed. Code ' + code)

  if (param && param.isResult) {
    const results = data
      ?.trim()
      ?.split('\n')
      .map((res) => JSON.parse(res))

    await Promise.all(
      results.map(async (result) => {
        const glb = await ThreeToGLB.convert(
          path.join(location, result.path),
          'part.json'
        )
        await writeFile(location, result.path + '.glb', JSON.stringify(glb))
      })
    )
  } else {
    const glb = await ThreeToGLB.convert(
      path.join(location, jsonTarget),
      'part.json'
    )
    await writeFile(location, glbTarget, JSON.stringify(glb))
  }

  return {
    json: jsonTarget,
    glb: glbTarget
  }
}

/**
 * Load part
 * @memberof Lib.Tools
 * @param {string} location Location
 * @param {string} name File name
 * @returns {Object} Part
 */
const loadPart = async (location, name) => {
  const partFile = path.join(location, name)
  const partData = await fs.readFile(partFile)
  const part = JSON.parse(partData)

  // Load solids
  if (part.solids) {
    await Promise.all(
      part.solids.map(async (solid) => {
        const file = path.join(location, solid.path)
        solid.buffer = await fs.readFile(file)
        delete solid.path
      })
    )
  }

  // Load faces
  if (part.faces) {
    await Promise.all(
      part.faces.map(async (face) => {
        const file = path.join(location, face.path)
        face.buffer = await fs.readFile(file)
        delete face.path
      })
    )
  }

  // Load edges
  if (part.edges) {
    await Promise.all(
      part.edges.map(async (edge) => {
        const file = path.join(location, edge.path)
        edge.buffer = await fs.readFile(file)
        delete edge.path
      })
    )
  }

  return part
}

/**
 * Remove file
 * @memberof Lib.Tools
 * @param {string} file File name
 */
const removeFile = async (file) => {
  await fs.unlink(file)
}

/**
 * Remove directory
 * @memberof Lib.Tools
 * @param {string} dir Directory
 */
const removeDirectory = async (dir) => {
  await fs.rm(dir, { recursive: true })
}

const Tools = {
  createPath,
  listFiles,
  listDirectories,
  writeFile,
  readFile,
  copyFile,
  convert,
  loadPart,
  removeFile,
  removeDirectory
}
export default Tools
