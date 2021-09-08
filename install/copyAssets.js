import { promises as fs } from 'fs'

const copyThreeAssets = async () => {
  // Create path
  try {
    await fs.mkdir('public/three/libs')
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }

  // Copy
  await fs.cp(
    'node_modules/three/examples/js/libs/draco',
    'public/three/libs/draco',
    { recursive: true }
  )
}

const copyAssets = async () => {
  await copyThreeAssets()
}

export default copyAssets
