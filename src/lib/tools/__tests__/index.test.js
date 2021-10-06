import Tools from '../'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: () => mockPath()
}))

const mockMkdir = jest.fn()
const mockReadDir = jest.fn()
const mockWriteFile = jest.fn()
const mockReadFile = jest.fn()
const mockCopyFile = jest.fn()
const mockUnlink = jest.fn()
const mockRmdir = jest.fn()
jest.mock('fs', () => ({
  promises: {
    mkdir: async () => mockMkdir(),
    readdir: async () => mockReadDir(),
    writeFile: async () => mockWriteFile(),
    readFile: async () => mockReadFile(),
    copyFile: async () => mockCopyFile(),
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
    mockCopyFile.mockReset()
    mockReadFile.mockImplementation(() => 'readFile')
    mockUnlink.mockReset()
    mockRmdir.mockReset()

    mockThreeToGLB.mockReset()
    mockThreeToGLB.mockImplementation(() => ({}))

    mockToThree.mockReset()
  })

  test('createPath', async () => {
    await Tools.createPath('location')
    expect(mockMkdir).toHaveBeenCalledTimes(1)
  })

  test('listFiles', async () => {
    mockReadDir.mockImplementation(() => ['file'])
    const files = await Tools.listFiles('location')
    expect(mockReadDir).toHaveBeenCalledTimes(1)
    expect(files).toEqual(['file'])
  })

  test('listDirectories', async () => {
    mockReadDir.mockImplementation(() => [
      { isDirectory: () => true, name: 'name1' },
      { isDirectory: () => false, name: 'name2' }
    ])
    const directories = await Tools.listDirectories('location')
    expect(mockReadDir).toHaveBeenCalledTimes(1)
    expect(directories).toEqual(['name1'])
  })

  test('writeFile', async () => {
    await Tools.writeFile('location', {})
    expect(mockMkdir).toHaveBeenCalledTimes(1)
    expect(mockWriteFile).toHaveBeenCalledTimes(1)
  })

  test('readFile', async () => {
    let content = await Tools.readFile('file')
    expect(mockReadFile).toHaveBeenCalledTimes(1)
    expect(content).toBe('readFile')

    mockReadFile.mockImplementation(() => '{"test": "test"}')
    content = await Tools.readFile('file', 'json')
    expect(mockReadFile).toHaveBeenCalledTimes(2)
    expect(content).toEqual({ test: 'test' })
  })

  test('copyFile', async () => {
    await Tools.copyFile('1', '2')
    expect(mockCopyFile).toHaveBeenCalledTimes(1)
  })

  test('convert', async () => {
    // Normal
    mockToThree.mockImplementation(() => ({ code: 0 }))
    await Tools.convert('location', { name: 'name' }, () => {})
    expect(mockWriteFile).toHaveBeenCalledTimes(1)

    // Result
    mockToThree.mockImplementation(() => ({
      code: 0,
      data: JSON.stringify({ path: 'test' })
    }))
    await Tools.convert('location', { name: 'name' }, () => {}, {
      isResult: true
    })
    expect(mockWriteFile).toHaveBeenCalledTimes(2)

    // Error
    try {
      mockToThree.mockImplementation(() => ({ code: 0, error: 'error' }))
      await Tools.convert('location', { name: 'name' }, () => {})
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe('Conversion process failed.')
      expect(true).toBe(true)
    }

    // Wrong code
    try {
      mockToThree.mockImplementation(() => ({ code: -1 }))
      await Tools.convert('location', { name: 'name' })
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }
  })

  test('loadPart', async () => {
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

  test('removeFile', async () => {
    await Tools.removeFile('file')
    expect(mockUnlink).toHaveBeenCalledTimes(1)
  })

  test('removeDirectory', async () => {
    await Tools.removeDirectory('directory')
    expect(mockRmdir).toHaveBeenCalledTimes(1)
  })
})
