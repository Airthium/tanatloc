import { promises as fs } from 'fs'

/**
 * Copy threejs assets
 * @memberof Install
 * @description Copy threejs assets in `public/three/libs`:
 * - `draco` libraries
 */
const copyThreeAssets = async (): Promise<void> => {
  // Create path
  try {
    await fs.mkdir('public/three/libs', { recursive: true })
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

/**
 * Copy assets
 * @memberof Install
 * @description Copy assets
 */
export const copyAssets = async (): Promise<void> => {
  await copyThreeAssets()
}
