import { promises as fs } from 'fs'
import ncp from 'ncp'

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
  // fs.cp only since 16.7.0, wait for electron
  // await fs.cp(
  //   'node_modules/three/examples/js/libs/draco',
  //   'public/three/libs/draco',
  //   { recursive: true }
  // )
  await new Promise(
    (resolve: (value: void) => void, reject: (reason: Error) => void) => {
      ncp(
        'node_modules/three/examples/js/libs/draco',
        'public/three/libs/draco',
        (err: Error) => {
          err && reject(err)
          resolve()
        }
      )
    }
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
