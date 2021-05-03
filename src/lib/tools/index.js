/** @module lib/tools */

import path from 'path'
import { promises as fs } from 'fs'
// import ThreeToGLB from 'three-to-glb'

import Services from '@/services'

import ThreeToGLB from '../../../modules/three-to-glb'

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
 */
const readFile = async (file) => {
  return fs.readFile(file)
}

/**
 * Convert file
 * @param {string} location Location
 * @param {Object} file File
 */
const convert = async (location, file) => {
  const origin = file.fileName
  const jsonTarget = file.uid
  const glbTarget = file.uid + '.glb'

  // TODO

  const { code, error } = await Services.toThree(location, origin, jsonTarget)

  console.log('three json OK')

  const part = await loadPart(path.join(location, jsonTarget), 'part.json')

  console.log('loadpart OK')

  const glb = await ThreeToGLB.convert(part)
  console.log(glb)
  await writeFile(location, glbTarget, glb.glb)

  if (error) throw new Error('Conversion process failed. Error: ' + error)
  if (code !== 0) throw new Error('Conversion process failed. Code ' + code)

  return {
    path: jsonTarget,
    part: 'part.json'
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
  await fs.rmdir(dir, { recursive: true })
}

export default {
  createPath,
  listFiles,
  writeFile,
  readFile,
  convert,
  loadPart,
  removeFile,
  removeDirectory
}
