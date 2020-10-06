import { add, get, update, del } from '../simulation'

let mockGet
const mockUpdate = jest.fn()
const mockDelete = jest.fn()
jest.mock('../../database/simulation', () => ({
  add: async () => ({ id: 'add' }),
  get: async () => mockGet(),
  update: async () => mockUpdate(),
  del: async () => mockDelete()
}))

const mockProject = jest.fn()
jest.mock('../project', () => ({
  update: async () => mockProject()
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
    mockGet = () => ({})
    mockUpdate.mockReset()
    mockDelete.mockReset()
    mockProject.mockReset()
    mockWriteFile.mockReset()
    mockConvert.mockReset()
    mockRemoveFile.mockReset()
    mockRemoveDirectory.mockReset()
  })

  it('add', async () => {
    const simulation = await add({}, {})
    expect(simulation).toEqual({ id: 'add' })
    expect(mockProject).toHaveBeenCalledTimes(1)
  })

  it('get', async () => {
    let simulation

    // Empty
    simulation = await get()
    expect(simulation).toEqual({})
  })

  it('update', async () => {
    mockGet = () => ({
      scheme: {
        categories: {
          geometry: {}
        }
      }
    })

    // Empty
    await update({}, [])
    expect(mockUpdate).toHaveBeenCalledTimes(1)

    // With not a file
    await update({}, [{}])
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)

    // Without scheme
    await update({}, [{}])
    expect(mockUpdate).toHaveBeenCalledTimes(3)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)

    // With undefined file
    await update({}, [
      {
        key: 'scheme',
        value: {
          file: undefined
        }
      }
    ])
    expect(mockUpdate).toHaveBeenCalledTimes(4)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)

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
    expect(mockUpdate).toHaveBeenCalledTimes(5)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(1)
    expect(mockConvert).toHaveBeenCalledTimes(1)

    // With old file
    mockGet = () => ({
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
    })
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
    expect(mockUpdate).toHaveBeenCalledTimes(6)
    expect(mockRemoveFile).toHaveBeenCalledTimes(1)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(1)
    expect(mockWriteFile).toHaveBeenCalledTimes(2)
    expect(mockConvert).toHaveBeenCalledTimes(2)

    // With empty old file
    mockGet = () => ({
      scheme: {
        categories: {
          geometry: {
            file: {}
          }
        }
      }
    })
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
    expect(mockUpdate).toHaveBeenCalledTimes(7)
    expect(mockRemoveFile).toHaveBeenCalledTimes(1)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(1)
    expect(mockWriteFile).toHaveBeenCalledTimes(3)
    expect(mockConvert).toHaveBeenCalledTimes(3)

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
    expect(mockUpdate).toHaveBeenCalledTimes(8)
    expect(mockRemoveFile).toHaveBeenCalledTimes(1)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(1)
    expect(mockWriteFile).toHaveBeenCalledTimes(3)
    expect(mockConvert).toHaveBeenCalledTimes(3)
  })

  it('delete', async () => {
    await del({}, {})
    expect(mockDelete).toHaveBeenCalledTimes(1)
    expect(mockProject).toHaveBeenCalledTimes(1)
  })
})
