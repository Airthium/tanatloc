const path = require('path')
const depcheck = require('depcheck')
const { getContent } = require('depcheck/dist/utils/file')
const { exit } = require('process')

/**
 * Custom typedeoc parser
 * @returns Deps array
 */
depcheck.special.customTypedoc = (fileName) => {
  const newDeps = []

  if (path.basename(fileName) === 'package.json') {
    const packageJson = require(fileName)

    Object.values(packageJson.scripts).forEach((script) => {
      if (script.includes('typedoc')) {
        newDeps.push('typedoc')
        newDeps.push('typedoc-plugin-airthium')
      }
    })
  }

  return newDeps
}

/**
 * Custom next.config.js parser
 * @returns Deps array
 */
depcheck.special.customNext = async (fileName) => {
  const newDeps = []

  if (path.basename(fileName) === 'next.config.js') {
    const content = await getContent(fileName)

    // Get strings
    const matches = content.matchAll(/'([^\n^']+)'/g)
    for (const match of matches) {
      const name = match[0].replace(/'/g, '')
      if (name.indexOf('.') === -1) newDeps.push(name)
    }
  }

  return newDeps
}

/**
 * Custom jest.config.js parser
 * @returns Deps array
 */
depcheck.special.customJest = (fileName, deps) => {
  const newDeps = []

  if (path.basename(fileName) === 'jest.config.js') {
    newDeps.push('jest-environment-jsdom')
    if (deps.includes('typescript')) newDeps.push('@types/jest')

    const config = require(fileName)
    Object.values(config.transform).forEach((value) => {
      if (!value.includes('<rootDir>')) newDeps.push(value)
    })
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
    'set-interval-async', // For plugins
    'url-join' // For plugins
  ],
  specials: [
    depcheck.special.bin,
    depcheck.special.eslint,
    depcheck.special.jest,
    depcheck.special.customTypedoc,
    depcheck.special.customNext,
    depcheck.special.customJest
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
