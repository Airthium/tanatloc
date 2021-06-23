/** @module lib/tools */

import path from 'path'
import { promises as fs } from 'fs'
import ThreeToGLB from 'three-to-glb'

import Services from '@/services'

/**
 * Create path (recursive)
 * @param {string} location Location path
 */
const createPath = async (location) => {
  await fs.mkdir(location, { recursive: true })
}

const listFiles = async (location) => {
  return fs.readdir(location, { withFileTypes: true })
}

/**
 * Write file
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
 * @param {string} file File name
 * @param {?string} type Type
 */
const readFile = async (file, type) => {
  const content = await fs.readFile(file)

  if (type === 'json') return JSON.parse(content.toString())
  return content
}

const copyFile = async (origin, destination) => {
  await createPath(destination.path)
  await fs.copyFile(
    path.join(origin.path, origin.file),
    path.join(destination.path, destination.file)
  )
}

/**
 * Convert file
 * @param {string} location Location
 * @param {Object} file File { name, target }
 * @param {Function?} callback Callback
 * @param {Object?} param Parameters { isResult: false }
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
  callback && callback({ data, error })

  if (error) throw new Error('Conversion process failed. Error: ' + error)
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
        await writeFile(location, result.path + '.glb', glb.data)
      })
    )
  } else {
    const glb = await ThreeToGLB.convert(
      path.join(location, jsonTarget),
      'part.json'
    )
    await writeFile(location, glbTarget, glb.data)
  }

  return {
    json: jsonTarget,
    glb: glbTarget
  }
}

/**
 * Load part
 * @param {string} location Location
 * @param {string} name File name
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
 * @param {string} file File name
 */
const removeFile = async (file) => {
  await fs.unlink(file)
}

/**
 * Remove directory
 * @param {string} dir Directory
 */
const removeDirectory = async (dir) => {
  await fs.rm(dir, { recursive: true })
}

const Tools = {
  createPath,
  listFiles,
  writeFile,
  readFile,
  copyFile,
  convert,
  loadPart,
  removeFile,
  removeDirectory
}
export default Tools
