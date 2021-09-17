import path from 'path'
import { promises as fs } from 'fs'

// Server build directory
const serverDir = process.argv.pop()

/**
 * List files
 * @param {string} base Base path
 * @returns {Array} Files list
 */
const listFiles = async (base) => {
  const files = await fs.readdir(base, { withFileTypes: true })
  files.forEach((file) => {
    file.name = path.join(base, file.name)
    file.location = base
  })

  await Promise.all(
    files.map(async (file) => {
      if (file.isDirectory()) {
        const newFiles = await listFiles(file.name)
        files.push(...newFiles)
      }
    })
  )

  return files
}

/**
 * Copy ejs files
 * @param {string} base Base path
 */
const copyEjs = async (base) => {
  const files = await listFiles(base)
  const ejsFiles = files
    .filter((file) => file.name.includes('.ejs'))
    .map((file) => ({
      name: file.name,
      location: file.location
    }))

  for (const ejsFile of ejsFiles) {
    // Check location
    try {
      await fs.stat(path.join(serverDir, ejsFile.location))
    } catch (err) {
      if (err.code === 'ENOENT') {
        await fs.mkdir(path.join(serverDir, ejsFile.location))
      }
    }

    // Copy file
    console.info(' - copy ' + ejsFile.name)
    await fs.copyFile(ejsFile.name, path.join(serverDir, ejsFile.name))
  }
}

/**
 * Copy all ejs files
 */
const copyAllEjs = async () => {
  console.info('Templates')

  // Check in templates
  await copyEjs('templates')

  // Chek in plugins
  await copyEjs('plugins')
}

/**
 * Main
 */
const main = async () => {
  await copyAllEjs()
}

main().catch(console.error)
