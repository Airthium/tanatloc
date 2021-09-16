import { promises as fs } from 'fs'
import ncp from 'ncp'

const copyThreeAssets = async () => {
  // Create path
  try {
    await fs.mkdir('public/three/libs', { recursive: true })
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }

  // Copy
  // fs.cp only since 16.7.0, wait for electron
  // await fs.cp(
  //   'node_modules/three/examples/js/libs/draco',
  //   'public/three/libs/draco',
  //   { recursive: true }
  // )
  await new Promise((resolve, reject) => {
    ncp(
      'node_modules/three/examples/js/libs/draco',
      'public/three/libs/draco',
      (err) => {
        err && reject(err)
        resolve()
      }
    )
  })
}

const copyAssets = async () => {
  await copyThreeAssets()
}

export default copyAssets
