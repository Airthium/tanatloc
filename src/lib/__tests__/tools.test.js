import {
  createPath,
  writeFile,
  convert,
  loadPart,
  removeFile,
  removeDirectory
} from '../tools'

jest.mock('path', () => ({
  join: () => 'path'
}))

const mockMkdir = jest.fn()
const mockWriteFile = jest.fn()
const mockReadFile = jest.fn(() => 'readFile')
const mockUnlink = jest.fn()
const mockRmdir = jest.fn()
jest.mock('fs', () => ({
  promises: {
    mkdir: async () => mockMkdir(),
    writeFile: async () => mockWriteFile(),
    readFile: async () => mockReadFile(),
    unlink: async () => mockUnlink(),
    rmdir: async () => mockRmdir()
  }
}))

let mockCallback
jest.mock('child_process', () => ({
  exec: (command, callback) => {
    mockCallback = callback
  }
}))

describe('src/lib/tools', () => {
  it('createPath', async () => {
    await createPath('location')
    expect(mockMkdir).toHaveBeenCalledTimes(1)
  })

  it('writeFile', async () => {
    await writeFile('location', {})
    expect(mockMkdir).toHaveBeenCalledTimes(2)
    expect(mockWriteFile).toHaveBeenCalledTimes(1)
  })

  it('convert', async () => {
    convert('location', { name: 'name' })
    mockCallback()

    convert('location', { name: 'name' })
    mockCallback('error')
  })

  it('loadPart', async () => {
    let part

    // Full
    JSON.parse = () => ({
      solids: [{}],
      faces: [{}],
      edges: [{}]
    })
    part = await loadPart('target', 'file')
    expect(part).toEqual({
      solids: [{ buffer: 'readFile' }],
      faces: [{ buffer: 'readFile' }],
      edges: [{ buffer: 'readFile' }]
    })
    expect(mockReadFile).toHaveBeenCalledTimes(4)

    // Empty
    JSON.parse = () => ({})
    part = await loadPart('target', 'file')
    expect(part).toEqual({})
    expect(mockReadFile).toHaveBeenCalledTimes(4 + 1)
  })

  it('removeFile', async () => {
    await removeFile('file')
    expect(mockUnlink).toHaveBeenCalledTimes(1)
  })

  it('removeDirectory', async () => {
    await removeDirectory('directory')
    expect(mockRmdir).toHaveBeenCalledTimes(1)
  })
})
