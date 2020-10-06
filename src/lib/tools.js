import path from 'path'
import { promises as fs } from 'fs'
import { exec } from 'child_process'

/**
 * Create path (recursive)
 * @param {string} location Location path
 */
export const createPath = async (location) => {
  await fs.mkdir(location, { recursive: true })
}

/**
 * Write file
 * @param {string} location Location
 * @param {string} name File name
 * @param {Object} content Content
 */
export const writeFile = async (location, name, content) => {
  await createPath(location)
  await fs.writeFile(path.join(location, name), content)
}

/**
 * Read file
 * @param {string} file File name
 */
export const readFile = async (file) => {
  const content = await fs.readFile(file)
  return content
}

/**
 * Convert file
 * @param {string} location Location
 * @param {Object} file File
 */
export const convert = async (location, file) => {
  const partPath = file.name.replace(/\.[^/.]+$/, '')
  const origin = path.join(location, file.name)
  const target = path.join(location, partPath)
  await new Promise((resolve, reject) => {
    exec(
      'docker run --rm -v ' +
        location +
        ':' +
        location +
        ' -u $(id -u):$(id -g) tanatloc/converters:latest StepToThreeJS ' +
        origin +
        ' ' +
        target,
      (error, stdout, stderr) => {
        if (error) reject(error)
        resolve(stdout)
      }
    )
  })

  return {
    path: partPath,
    part: 'part.json'
  }
}

/**
 * Load part
 * @param {string} location Location
 * @param {string} name File name
 */
export const loadPart = async (location, name) => {
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
export const removeFile = async (file) => {
  await fs.unlink(file)
}

/**
 * Remove directory
 * @param {string} dir Directory
 */
export const removeDirectory = async (dir) => {
  await fs.rmdir(dir, { recursive: true })
}
