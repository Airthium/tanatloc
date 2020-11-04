import {
  createPath,
  writeFile,
  readFile,
  convert,
  loadPart,
  removeFile,
  removeDirectory
} from '../tools'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: () => mockPath()
}))

const mockMkdir = jest.fn()
const mockWriteFile = jest.fn()
const mockReadFile = jest.fn()
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

let mockCallback = 0
jest.mock('child_process', () => ({
  exec: (command, callback) => {
    mockCallback++
    if (mockCallback === 1) callback()
    else callback('error')
  }
}))

describe('src/lib/tools', () => {
  beforeEach(() => {
    mockMkdir.mockReset()
    mockWriteFile.mockReset()
    mockReadFile.mockReset()
    mockReadFile.mockImplementation(() => 'readFile')
    mockUnlink.mockReset()
    mockRmdir.mockReset()
  })

  it('createPath', async () => {
    await createPath('location')
    expect(mockMkdir).toHaveBeenCalledTimes(1)
  })

  it('writeFile', async () => {
    await writeFile('location', {})
    expect(mockMkdir).toHaveBeenCalledTimes(1)
    expect(mockWriteFile).toHaveBeenCalledTimes(1)
  })

  it('readFile', async () => {
    const content = await readFile('file')
    expect(mockReadFile).toHaveBeenCalledTimes(1)
    expect(content).toBe('readFile')
  })

  it('convert', async () => {
    await convert('location', { name: 'name' })

    try {
      await convert('location', { name: 'name' })
      expect(false).toBe(true)
    } catch (err) {
      expect(true).toBe(true)
    }
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
