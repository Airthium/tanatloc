/** @module Install.CopyAssets */

import { promises as fs } from 'fs'

/**
 * Copy templates
 *
 * Copy templates in `public/templates` for editor
 */
const copyTemplates = async (): Promise<void> => {
  // Create path
  try {
    await fs.mkdir('public/templates', { recursive: true })
  } catch (err: any) {
    if (err.code !== 'EEXIST') throw err
  }

  // Copy
  await fs.cp('templates', 'public/templates', {
    recursive: true
  })
}

/**
 * Copy MathJax assets
 *
 * Copy MathJax assets in `public/mathjax`
 */
const copyMathjaxAssets = async (): Promise<void> => {
  // Create path
  try {
    await fs.mkdir('public/mathjax', {
      recursive: true
    })
  } catch (err: any) {
    if (err.code !== 'EEXIST') throw err
  }

  // Copy
  await fs.cp('node_modules/mathjax/es5', 'public/mathjax', { recursive: true })
}

/**
 * Copy assets
 *
 * Copy assets
 */
export const copyAssets = async (): Promise<void> => {
  console.info(' == Copy assets == ')
  try {
    await copyTemplates()
  } catch (err) {
    console.warn(' ⚠ Unable to copy Templates')
    console.warn(err)
  }
  try {
    await copyMathjaxAssets()
  } catch (err) {
    console.warn(' ⚠ Unable to copy MathJax assets')
    console.warn(err)
  }
}
