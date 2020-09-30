import path from 'path'
import { promises as fs } from 'fs'
import { exec } from 'child_process'

export const createPath = async (path) => {
  await fs.mkdir(path, { recursive: true })
}

export const writeFile = async (location, name, content) => {
  await createPath(location)
  await fs.writeFile(path.join(location, name), content)
}

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

export const loadPart = async (target, file) => {
  const partFile = path.join(target, file)
  const partData = await fs.readFile(partFile)
  const part = JSON.parse(partData)

  // Load solids
  if (part.solids) {
    await Promise.all(
      part.solids.map(async (solid) => {
        const file = path.join(target, solid.path)
        solid.buffer = await fs.readFile(file)
        delete solid.path
      })
    )
  }

  // Load faces
  if (part.faces) {
    await Promise.all(
      part.faces.map(async (face) => {
        const file = path.join(target, face.path)
        face.buffer = await fs.readFile(file)
        delete face.path
      })
    )
  }

  // Load edges
  if (part.edges) {
    await Promise.all(
      part.edges.map(async (edge) => {
        const file = path.join(target, edge.path)
        edge.buffer = await fs.readFile(file)
        delete edge.path
      })
    )
  }

  return part
}
