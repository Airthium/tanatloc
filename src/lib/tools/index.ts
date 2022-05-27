/** @module Lib.Tools */

import path from 'path'
import {
  Dirent,
  ReadStream,
  WriteStream,
  createReadStream,
  createWriteStream,
  promises as fs
} from 'fs'
import tar from 'tar'

import Services from '@/services'

/**
 * Path to posix
 * @param str Path
 * @returns POSIX path
 */
const toPosix = (str: string): string => {
  return str.split(path.sep).join(path.posix.sep)
}

/**
 * Create path (recursive)
 * @param location Location path
 */
const createPath = async (location: string): Promise<void> => {
  await fs.mkdir(location, { recursive: true })
}

/**
 * List files
 * @param location Location
 * @returns Files list (with types)
 */
const listFiles = async (location: string): Promise<Dirent[]> => {
  return fs.readdir(location, { withFileTypes: true })
}

/**
 * List directories
 * @param location Location
 * @returns Directory list
 */
const listDirectories = async (location: string): Promise<string[]> => {
  const files = await listFiles(location)
  return files
    .map((file) => {
      if (file.isDirectory()) return file.name
    })
    .filter((f) => f) as string[]
}

/**
 * Write file
 * @param location Location
 * @param name File name
 * @param content Content
 */
const writeFile = async (
  location: string,
  name: string,
  content: Buffer | string
): Promise<void> => {
  await createPath(location)
  await fs.writeFile(path.join(location, name), content)
}

/**
 * Read file
 * @param file File name
 * @param options Options
 * @returns File content
 */
const readFile = async (
  file: string,
  options?: any
): Promise<Buffer | string> => {
  return fs.readFile(file, options)
}

const readJSONFile = async (file: string): Promise<any> => {
  const content = await readFile(file)
  return JSON.parse(content.toString())
}

/**
 * Copy file
 * @param origin Origin path
 * @param destination Destination
 */
const copyFile = async (
  origin: { path: string; file: string },
  destination: { path: string; file: string }
): Promise<void> => {
  await createPath(destination.path)
  await fs.copyFile(
    path.join(origin.path, origin.file),
    path.join(destination.path, destination.file)
  )
}

/**
 * Copy directory
 * @param origin Origin path
 * @param destination Destination
 */
const copyDirectory = async (
  origin: string,
  destination: string
): Promise<void> => {
  await createPath(destination)
  await fs.cp(origin, destination, { recursive: true, force: true })
}

/**
 * Remove file
 * @param file File name
 */
const removeFile = async (file: string): Promise<void> => {
  await fs.unlink(file)
}

/**
 * Remove directory
 * @param dir Directory
 */
const removeDirectory = async (dir: string): Promise<void> => {
  await fs.rm(dir, { recursive: true })
}

/**
 * Tar
 * @param target Target
 * @param directory Directory
 */
const archive = async (
  target: string,
  directory: { C: string; path: string }
): Promise<void> => {
  await tar.c(
    {
      gzip: true,
      C: directory.C,
      file: target
    },
    [directory.path]
  )
}

const unarchive = async (
  source: string,
  directory: { C: string; path: string }
): Promise<void> => {
  await tar.x({ file: source, C: directory.C }, [directory.path])
}

/**
 * Create read stream
 * @param file File
 * @returns Read stream
 */
const readStream = (file: string): ReadStream => {
  return createReadStream(file)
}

/**
 * Create write stream
 * @param file File
 * @returns Write stream
 */
const writeStream = (file: string): WriteStream => {
  return createWriteStream(file)
}

/**
 * Convert file
 * @param location Location
 * @param file File
 * @param callback Callback
 * @param param Parameters
 * @returns Data
 */
const convert = async (
  location: string,
  file: { name: string; target: string },
  callback?: (data: { data?: string; error?: string }) => void,
  param?: { isResult: boolean }
): Promise<{ name: string; glb: string }[]> => {
  const origin = file.name
  const genericGlb = file.target
  const glbTarget = genericGlb + '.glb'

  const { code, data, error } = await Services.toThree(
    location,
    origin,
    param?.isResult ? genericGlb : glbTarget
  )
  callback?.({ data, error })

  if (error) {
    const err = new Error('Conversion process failed.')
    data && (err.message += '\nData: ' + data)
    err.message += '\nError: ' + error
    throw err
  }
  if (code !== 0) {
    const err = new Error('Conversion process failed. Code ' + code + '.')
    data && (err.message += '\nData: ' + data)
    error && (err.message += '\nError: ' + error)
    throw err
  }

  if (param?.isResult) {
    return data
      .trim()
      .split('\n')
      .map((res) => JSON.parse(res))
  }

  return [
    {
      name: file.name,
      glb: glbTarget
    }
  ]
}

const Tools = {
  toPosix,
  createPath,
  listFiles,
  listDirectories,
  writeFile,
  readFile,
  readJSONFile,
  copyFile,
  copyDirectory,
  removeFile,
  removeDirectory,
  archive,
  unarchive,
  readStream,
  writeStream,
  convert
}
export default Tools
