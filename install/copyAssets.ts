/** @module Install.CopyAssets */

import { promises as fs } from 'fs'

/**
 * Copy threejs assets
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
 * Copy MathJax assets
 * @description Copy MathJax assets in `public/mathjax`:
 */
const copyMathjaxAssets = async (): Promise<void> => {
  // Create path
  try {
    await fs.mkdir('public/mathjax/output/chtml/fonts/woff-v2', {
      recursive: true
    })
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }

  // Copy
  await fs.cp(
    'node_modules/mathjax/es5/tex-mml-chtml.js',
    'public/mathjax/tex-mml-chtml.js'
  )

  await fs.cp(
    'node_modules/mathjax/es5/output/chtml.js',
    'public/mathjax/output/chtml.js'
  )

  await fs.cp(
    'node_modules/mathjax/es5/output/chtml',
    'public/mathjax/output/chtml',
    { recursive: true }
  )
}

/**
 * Copy assets
 * @description Copy assets
 */
export const copyAssets = async (): Promise<void> => {
  await copyThreeAssets()
  await copyMathjaxAssets()
}
