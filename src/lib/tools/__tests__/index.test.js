import Tools from '../'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: () => mockPath()
}))

const mockMkdir = jest.fn()
const mockReadDir = jest.fn()
const mockWriteFile = jest.fn()
const mockReadFile = jest.fn()
const mockUnlink = jest.fn()
const mockRmdir = jest.fn()
jest.mock('fs', () => ({
  promises: {
    mkdir: async () => mockMkdir(),
    readdir: async () => mockReadDir(),
    writeFile: async () => mockWriteFile(),
    readFile: async () => mockReadFile(),
    unlink: async () => mockUnlink(),
    rm: async () => mockRmdir()
  }
}))

const mockThreeToGLB = jest.fn()
jest.mock('three-to-glb', () => ({
  convert: () => mockThreeToGLB()
}))

const mockToThree = jest.fn()
jest.mock('@/services', () => ({
  toThree: async (path, fileIn, pathOut) => mockToThree(path, fileIn, pathOut)
}))

describe('lib/tools', () => {
  beforeEach(() => {
    mockPath.mockReset()

    mockMkdir.mockReset()
    mockReadDir.mockReset()
    mockWriteFile.mockReset()
    mockReadFile.mockReset()
    mockReadFile.mockImplementation(() => 'readFile')
    mockUnlink.mockReset()
    mockRmdir.mockReset()

    mockThreeToGLB.mockReset()

    mockToThree.mockReset()
  })

  it('createPath', async () => {
    await Tools.createPath('location')
    expect(mockMkdir).toHaveBeenCalledTimes(1)
  })

  it('listFiles', async () => {
    mockReadDir.mockImplementation(() => ['file'])
    const files = await Tools.listFiles('location')
    expect(mockReadDir).toHaveBeenCalledTimes(1)
    expect(files).toEqual(['file'])
  })

  it('writeFile', async () => {
    await Tools.writeFile('location', {})
    expect(mockMkdir).toHaveBeenCalledTimes(1)
    expect(mockWriteFile).toHaveBeenCalledTimes(1)
  })

  it('readFile', async () => {
    const content = await Tools.readFile('file')
    expect(mockReadFile).toHaveBeenCalledTimes(1)
    expect(content).toBe('readFile')
  })

  it('convert', async () => {
    mockToThree.mockImplementation((path, fileIn, pathOut) => {
      return { code: 0 }
    })
    await Tools.convert('location', { name: 'name' }, () => {})
    expect(mockWriteFile).toHaveBeenCalledTimes(1)

    try {
      mockToThree.mockImplementation(() => ({ code: -1 }))
      await Tools.convert('location', { name: 'name' })
      expect(true).toBe(false)
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
    part = await Tools.loadPart('target', 'file')
    expect(part).toEqual({
      solids: [{ buffer: 'readFile' }],
      faces: [{ buffer: 'readFile' }],
      edges: [{ buffer: 'readFile' }]
    })
    expect(mockReadFile).toHaveBeenCalledTimes(4)

    // Empty
    JSON.parse = () => ({})
    part = await Tools.loadPart('target', 'file')
    expect(part).toEqual({})
    expect(mockReadFile).toHaveBeenCalledTimes(4 + 1)
  })

  it('removeFile', async () => {
    await Tools.removeFile('file')
    expect(mockUnlink).toHaveBeenCalledTimes(1)
  })

  it('removeDirectory', async () => {
    await Tools.removeDirectory('directory')
    expect(mockRmdir).toHaveBeenCalledTimes(1)
  })
})
