import { basename } from 'path'
import depcheck from 'depcheck'
import { getContent } from 'depcheck/dist/utils/file'
import { exit } from 'process'

/**
 * Custom typedeoc parser
 * @returns Deps array
 */
const customTypedoc = async (fileName) => {
  const newDeps = []

  try {
    if (basename(fileName) === 'package.json') {
      const packageJson = (await import(fileName, { assert: { type: 'json' } }))
        .default
      Object.values(packageJson.scripts).forEach((script) => {
        if (script.includes('typedoc')) {
          newDeps.push('typedoc')
          newDeps.push('@airthium/typedoc-plugin-airthium')
        }
        if (script.includes('depcheck')) newDeps.push('depcheck')
      })
    }
  } catch (err) {
    console.error(err)
  }

  return newDeps
}

/**
 * Custom next.config.js parser
 * @returns Deps array
 */
const customNext = async (fileName) => {
  const newDeps = []

  try {
    if (basename(fileName) === 'next.config.mjs') {
      const content = await getContent(fileName)

      // Get strings
      const matches = content.matchAll(/'([^\n^']+)'/g)
      for (const match of matches) {
        const name = match[0].replace(/'/g, '')
        if (name.indexOf('.') === -1) newDeps.push(name)
      }
    }
  } catch (err) {
    console.error(err)
  }

  return newDeps
}

/**
 * Custom jest.config.js parser
 * @returns Deps array
 */
const customJest = async (fileName, deps) => {
  const newDeps = []

  try {
    if (basename(fileName) === 'jest.config.js') {
      newDeps.push('jest-environment-jsdom')
      if (deps.includes('typescript')) newDeps.push('@types/jest')

      const config = (await import(fileName)).default
      Object.values(config.transform).forEach((value) => {
        if (!value.includes('<rootDir>')) newDeps.push(value[0])
      })
    }
  } catch (err) {
    console.error(err)
  }

  return newDeps
}

const options = {
  ignoreMatches: [
    'mathjax', // MathJax
    'electron', // Mandatory for electron-store
    'electron-serve', // Mandatory for electron-store
    'form-data', // For plugins
    'node-fetch', // For plugins
    'url-join' // For plugins
  ],
  specials: [
    depcheck.special.bin,
    depcheck.special.eslint,
    depcheck.special.jest,
    customTypedoc,
    customNext,
    customJest
  ]
}

depcheck(process.cwd(), options, (unused) => {
  let error = 0

  if (unused.dependencies.length) {
    console.error('Unused dependencies:')
    console.error(unused.dependencies)
    console.error()
    error++
  }

  if (unused.devDependencies.length) {
    console.error('Unused dev dependencies:')
    console.error(unused.devDependencies)
    console.error()
    error++
  }

  if (Object.keys(unused.missing).length) {
    console.warn('Missing dependencies:')
    console.warn(unused.missing)
    console.warn()
  }

  if (error) exit(1)
})
