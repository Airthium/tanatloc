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
import { create, extract } from 'tar'
import crypto from 'crypto'

import SecurityDB from '@/database/security'

import Services from '@/services'

const algorithm = 'aes-256-ctr'

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
const readFile = async (file: string, options?: any): Promise<Buffer> => {
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
  await create(
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
  await extract({ file: source, C: directory.C }, [directory.path])
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
): Promise<{ name: string; glb: string; brep?: string }[]> => {
  const origin = file.name
  const genericGlb = file.target
  const glbTarget = genericGlb + '.glb'
  const brepTarget = genericGlb + '.brep'

  const { code, data, error } = await Services.toThree(
    location,
    origin,
    param?.isResult ? genericGlb : glbTarget,
    brepTarget
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
    throw err
  }

  if (param?.isResult) {
    if (!data) return []
    return data
      .trim()
      .split('\n')
      .map((res) => JSON.parse(res))
  }

  return [
    {
      name: file.name,
      glb: glbTarget,
      brep: brepTarget
    }
  ]
}

/**
 * Get encrypt pass
 * @returns Encrypt pass
 */
const getEncryptPass = async (): Promise<string> =>
  (await SecurityDB.get(['encrypt_pass'])).encrypt_pass

/**
 * Encrypt text
 * @param text Text
 * @returns Hash
 */
const encrypt = async (
  text: string
): Promise<{ iv: string; content: string }> => {
  const encryptPass = await getEncryptPass()
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, encryptPass, iv)
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  }
}

/**
 * Decrypt hash
 * @param hash Hash
 * @returns Decrypted text
 */
const decrypt = async ({
  iv,
  content
}: {
  iv: string
  content: string
}): Promise<string> => {
  const encryptPass = await getEncryptPass()
  const decipher = crypto.createDecipheriv(
    algorithm,
    encryptPass,
    Buffer.from(iv, 'hex')
  )
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(content, 'hex')),
    decipher.final()
  ])
  return decrypted.toString()
}

const splitStep = async (
  location: string,
  fileIn: string
): Promise<string[]> => {
  const executable = 'StepSplit'
  const { code, data, error } = await Services.custom(location, executable, [
    fileIn
  ])

  if (error) throw new Error(error)

  if (code !== 0) {
    const err = new Error('Split STEP process failed. Code ' + code + '.')
    data && (err.message += '\nData: ' + data)
    throw err
  }

  return data.split('\n').filter((d) => d)
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
  convert,
  encrypt,
  decrypt,
  splitStep
}
export default Tools
