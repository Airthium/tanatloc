import Tools from '../'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: () => mockPath(),
  sep: '\\',
  posix: {
    sep: '/'
  }
}))

const mockCreateReadStream = jest.fn()
const mockCreateWriteStream = jest.fn()
const mockMkdir = jest.fn()
const mockReadDir = jest.fn()
const mockWriteFile = jest.fn()
const mockReadFile = jest.fn()
const mockCopyFile = jest.fn()
const mockUnlink = jest.fn()
const mockRmdir = jest.fn()
const mockCp = jest.fn()
jest.mock('fs', () => ({
  createReadStream: () => mockCreateReadStream(),
  createWriteStream: () => mockCreateWriteStream(),
  promises: {
    mkdir: async () => mockMkdir(),
    readdir: async () => mockReadDir(),
    writeFile: async () => mockWriteFile(),
    readFile: async () => mockReadFile(),
    copyFile: async () => mockCopyFile(),
    unlink: async () => mockUnlink(),
    rm: async () => mockRmdir(),
    cp: async () => mockCp()
  }
}))

const mockTarC = jest.fn()
const mockTarX = jest.fn()
jest.mock('tar', () => ({
  c: () => mockTarC(),
  x: () => mockTarX()
}))

const mockThreeToGLB = jest.fn()
jest.mock('three-to-glb', () => ({
  threeToGlb: () => mockThreeToGLB()
}))

const mockToThree = jest.fn()
jest.mock('@/services', () => ({
  toThree: async (path: string, fileIn: string, pathOut: string) =>
    mockToThree(path, fileIn, pathOut)
}))

describe('lib/tools', () => {
  beforeEach(() => {
    mockPath.mockReset()

    mockCreateReadStream.mockReset()
    mockCreateWriteStream.mockReset()
    mockMkdir.mockReset()
    mockReadDir.mockReset()
    mockWriteFile.mockReset()
    mockReadFile.mockReset()
    mockCopyFile.mockReset()
    mockReadFile.mockImplementation(() => 'readFile')
    mockUnlink.mockReset()
    mockRmdir.mockReset()

    mockTarC.mockReset()
    mockTarX.mockReset()

    mockThreeToGLB.mockReset()
    mockThreeToGLB.mockImplementation(() => ({}))

    mockToThree.mockReset()
  })

  test('toPosix', () => {
    const posixPath = Tools.toPosix('windows\\path')
    expect(posixPath).toBe('windows/path')
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
    await Tools.writeFile('location', 'name', Buffer.from('buffer'))
    expect(mockMkdir).toHaveBeenCalledTimes(1)
    expect(mockWriteFile).toHaveBeenCalledTimes(1)
  })

  test('readFile', async () => {
    const content = await Tools.readFile('file')
    expect(mockReadFile).toHaveBeenCalledTimes(1)
    expect(content).toBe('readFile')
  })

  test('readJSONFile', async () => {
    mockReadFile.mockImplementation(() => '{"test": "test"}')
    const content = await Tools.readJSONFile('file')
    expect(mockReadFile).toHaveBeenCalledTimes(1)
    expect(content).toEqual({ test: 'test' })
  })

  test('copyFile', async () => {
    await Tools.copyFile(
      { path: 'path', file: 'file' },
      { path: 'path', file: 'file' }
    )
    expect(mockCopyFile).toHaveBeenCalledTimes(1)
  })

  test('copyDirectory', async () => {
    await Tools.copyDirectory('origin', 'destination')
    expect(mockCp).toHaveBeenCalledTimes(1)

    mockCp.mockImplementation(() => {
      throw new Error('error')
    })
    try {
      await Tools.copyDirectory('origin', 'destination')
    } catch (err: any) {
      expect(err.message).toBe('error')
    }
    expect(mockCp).toHaveBeenCalledTimes(2)
  })

  test('removeFile', async () => {
    await Tools.removeFile('file')
    expect(mockUnlink).toHaveBeenCalledTimes(1)
  })

  test('removeDirectory', async () => {
    await Tools.removeDirectory('directory')
    expect(mockRmdir).toHaveBeenCalledTimes(1)
  })

  test('archive', async () => {
    await Tools.archive('target', { C: 'C', path: 'path' })
    expect(mockTarC).toHaveBeenCalledTimes(1)
  })

  test('unarchive', async () => {
    await Tools.unarchive('source', { C: 'C', path: 'path' })
    expect(mockTarX).toHaveBeenCalledTimes(1)
  })

  test('readStream', () => {
    Tools.readStream('file')
    expect(mockCreateReadStream).toHaveBeenCalledTimes(1)
  })

  test('writeStream', () => {
    Tools.writeStream('file')
    expect(mockCreateWriteStream).toHaveBeenCalledTimes(1)
  })

  test('convert', async () => {
    // Normal
    mockToThree.mockImplementation(() => ({ code: 0 }))
    await Tools.convert('location', { name: 'name', target: 'target' }, () => {
      // Empty
    })
    expect(mockWriteFile).toHaveBeenCalledTimes(1)

    // Result
    mockToThree.mockImplementation(() => ({
      code: 0,
      data: JSON.stringify({ path: 'test' })
    }))
    await Tools.convert(
      'location',
      { name: 'name', target: 'target' },
      () => {
        // Empty
      },
      {
        isResult: true
      }
    )
    expect(mockWriteFile).toHaveBeenCalledTimes(2)

    // Error
    try {
      mockToThree.mockImplementation(() => ({ code: 0, error: 'error' }))
      await Tools.convert(
        'location',
        { name: 'name', target: 'target' },
        () => {
          // Empty
        }
      )
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('Conversion process failed.')
      expect(true).toBe(true)
    }

    // Wrong code
    try {
      mockToThree.mockImplementation(() => ({ code: -1 }))
      await Tools.convert('location', { name: 'name', target: 'target' })
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }
  })
})
