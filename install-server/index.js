import path from 'path'
import { promises as fs } from 'fs'

const listFiles = async (base) => {
  const files = await fs.readdir(base, { withFileTypes: true })
  // TODO promise
  //   files.forEach((file) => {
  //     if (file.isDirectory()) {
  //       const newFiles = await listFiles(path.join(base, file.name))
  //       files.push(...newFiles)
  //     }
  //   })
}

const copyEjs = async () => {
  // Check in templates
  const files = listFiles('/templates')
  const ejsFiles = files.filter((file) => file.name.includes('.ejs'))
  console.log(ejsFiles)

  // Chek in plugins
  // TODO
}

const copySvg = async () => {
  // Check in plugins
  // TODO
}

const main = async () => {
  await copyEjs()
  await copySvg()
}

main().catch(console.error)
