import { add, get, update, del } from '../simulation'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: () => mockPath()
}))

jest.mock('../../../config/storage', () => ({}))

const mockAdd = jest.fn()
const mockGet = jest.fn()
const mockUpdate = jest.fn()
const mockDelete = jest.fn()
jest.mock('../../database/simulation', () => ({
  add: async () => mockAdd(),
  get: async () => mockGet(),
  update: async () => mockUpdate(),
  del: async () => mockDelete()
}))

const mockUpdateProject = jest.fn()
jest.mock('../project', () => ({
  update: async () => mockUpdateProject()
}))

const mockWriteFile = jest.fn()
const mockConvert = jest.fn()
const mockRemoveFile = jest.fn()
const mockRemoveDirectory = jest.fn()
jest.mock('../tools', () => ({
  writeFile: async () => mockWriteFile(),
  convert: async () => mockConvert(),
  removeFile: async () => mockRemoveFile(),
  removeDirectory: async () => mockRemoveDirectory()
}))

describe('src/lib/simulation', () => {
  beforeEach(() => {
    mockPath.mockReset()
    mockAdd.mockReset()
    mockGet.mockReset()
    mockUpdate.mockReset()
    mockDelete.mockReset()
    mockUpdateProject.mockReset()
    mockWriteFile.mockReset()
    mockConvert.mockReset()
    mockRemoveFile.mockReset()
    mockRemoveDirectory.mockReset()
  })

  it('add', async () => {
    mockAdd.mockImplementation(() => ({
      id: 'id'
    }))
    const simulation = await add({
      project: { id: 'id' },
      simulation: { name: 'name', scheme: 'scheme' }
    })
    expect(mockPath).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(1)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)
    expect(simulation).toEqual({ id: 'id' })
  })

  it('get', async () => {
    mockGet.mockImplementation(() => ({}))
    const simulation = await get('id', [])
    expect(mockPath).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)
    expect(simulation).toEqual({})
  })

  it('update', async () => {
    mockGet.mockImplementation(() => ({
      scheme: {
        categories: {
          geometry: {}
        }
      }
    }))

    // Empty
    await update({}, [])
    expect(mockPath).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)

    // With not a file
    await update({}, [{}])
    expect(mockPath).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)

    // Without scheme
    await update({}, [{}])
    expect(mockPath).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(3)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)

    // With undefined file
    await update({}, [
      {
        key: 'scheme',
        value: {
          file: undefined
        }
      }
    ])
    expect(mockPath).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(4)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)

    // With file
    mockConvert.mockImplementation(() => ({
      path: 'path'
    }))
    await update({ id: 'id' }, [
      {
        key: 'scheme',
        path: ['categories', 'geometry'],
        value: {
          file: {
            buffer: ['buffer']
          }
        }
      }
    ])
    expect(mockPath).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(5)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(1)
    expect(mockConvert).toHaveBeenCalledTimes(1)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)

    // With old file
    mockGet.mockImplementation(() => ({
      scheme: {
        categories: {
          geometry: {
            file: {
              part: 'part',
              partPath: 'path',
              origin: 'origin',
              originPath: 'originPath'
            }
          }
        }
      }
    }))
    await update({ id: 'id' }, [
      {
        key: 'scheme',
        path: ['categories', 'geometry'],
        value: {
          file: {
            buffer: ['buffer']
          }
        }
      }
    ])
    expect(mockPath).toHaveBeenCalledTimes(6)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(6)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(2)
    expect(mockConvert).toHaveBeenCalledTimes(2)
    expect(mockRemoveFile).toHaveBeenCalledTimes(1)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(1)

    // With empty old file
    mockGet.mockImplementation(() => ({
      scheme: {
        categories: {
          geometry: {
            file: {}
          }
        }
      }
    }))
    await update({ id: 'id' }, [
      {
        key: 'scheme',
        path: ['categories', 'geometry'],
        value: {
          file: {
            buffer: ['buffer']
          }
        }
      }
    ])
    expect(mockPath).toHaveBeenCalledTimes(8)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockUpdate).toHaveBeenCalledTimes(7)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(3)
    expect(mockConvert).toHaveBeenCalledTimes(3)
    expect(mockRemoveFile).toHaveBeenCalledTimes(1)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(1)

    // With file to remove
    await update({ id: 'id' }, [
      {
        key: 'scheme',
        path: ['categories', 'geometry'],
        value: {
          file: 'remove'
        }
      }
    ])
    expect(mockPath).toHaveBeenCalledTimes(8)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(4)
    expect(mockUpdate).toHaveBeenCalledTimes(8)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(3)
    expect(mockConvert).toHaveBeenCalledTimes(3)
    expect(mockRemoveFile).toHaveBeenCalledTimes(1)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(1)
  })

  it('delete', async () => {
    await del({}, {})
    expect(mockPath).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(1)
    expect(mockUpdateProject).toHaveBeenCalledTimes(1)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)
  })
})
