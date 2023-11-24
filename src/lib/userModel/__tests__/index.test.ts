import { IModel } from '@/models/index.d'

import UserModel from '..'

const mockAdd = jest.fn()
const mockGet = jest.fn()
const mockUpdate = jest.fn()
const mockDel = jest.fn()
jest.mock('@/database/userModel', () => ({
  add: async () => mockAdd(),
  get: async () => mockGet(),
  update: async () => mockUpdate(),
  del: async () => mockDel()
}))

const mockUserGet = jest.fn()
const mockUserGetWithData = jest.fn()
const mockUserUpdate = jest.fn()
jest.mock('../../user', () => ({
  get: async () => mockUserGet(),
  getWithData: async () => mockUserGetWithData(),
  update: async () => mockUserUpdate()
}))

const mockGroupGet = jest.fn()
const mockGroupUpdate = jest.fn()
jest.mock('../../group', () => ({
  get: async () => mockGroupGet(),
  update: async () => mockGroupUpdate()
}))

describe('lib/userModel', () => {
  beforeEach(() => {
    mockAdd.mockReset()
    mockGet.mockReset()
    mockUpdate.mockReset()
    mockDel.mockReset()

    mockUserGet.mockReset()
    mockUserGetWithData.mockReset()
    mockUserUpdate.mockReset()

    mockGroupGet.mockReset()
    mockGroupUpdate.mockReset()
  })

  test('add', async () => {
    mockAdd.mockImplementation(() => ({ id: 'id', model: {} }))
    const newModel = await UserModel.add(
      { model: {} as IModel, template: '' },
      { id: 'id' }
    )
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)
    expect(newModel).toEqual({ id: 'id', model: { userModelId: 'id' } })
  })

  test('getWithData', async () => {
    // Normal
    mockGet.mockImplementation(() => ({}))
    await UserModel.getWithData('id', ['model', 'template'])
    expect(mockGet).toHaveBeenCalledTimes(1)

    // With data
    await UserModel.getWithData('id', [
      'model',
      'template',
      'owners',
      'users',
      'groups'
    ])
    expect(mockGet).toHaveBeenCalledTimes(2)

    // With owners, users, groups
    mockGet.mockImplementation(() => ({
      owners: ['id', 'id'],
      users: ['id', 'id'],
      groups: ['id', 'id']
    }))
    mockUserGetWithData
      .mockImplementationOnce(() => ({}))
      .mockImplementation(() => undefined)
    mockGroupGet
      .mockImplementationOnce(() => ({}))
      .mockImplementation(() => undefined)
    await UserModel.getWithData('id', ['model', 'template'])
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockUserGetWithData).toHaveBeenCalledTimes(4)
    expect(mockGroupGet).toHaveBeenCalledTimes(2)

    // Undefined
    mockGet.mockImplementation(() => undefined)
    await UserModel.getWithData('id', ['model', 'template'])
    expect(mockGet).toHaveBeenCalledTimes(4)
  })

  test('update', async () => {
    // Simple
    await UserModel.update({ id: 'id' }, [
      {
        key: 'key',
        value: 'value'
      }
    ])
    expect(mockUpdate).toHaveBeenCalledTimes(1)

    // Groups & users update
    mockGet.mockImplementation(() => ({
      users: ['id1', 'id4', 'id5', 'id6'],
      groups: ['id1', 'id4', 'id5', 'id6']
    }))
    mockUserGetWithData.mockImplementation(() => ({}))
    mockUserGet
      .mockImplementationOnce(() => undefined)
      .mockImplementationOnce(() => ({ usermodels: [] }))
      .mockImplementationOnce(() => ({ usermodels: ['id'] }))
    mockGroupGet
      .mockImplementationOnce(() => ({}))
      .mockImplementationOnce(() => ({}))
      .mockImplementationOnce(() => ({}))
      .mockImplementationOnce(() => undefined)
      .mockImplementationOnce(() => ({ usermodels: [] }))
      .mockImplementationOnce(() => ({ usermodels: ['id'] }))
    await UserModel.update({ id: 'id' }, [
      {
        key: 'users',
        value: ['id1', 'id2', 'id3']
      },
      {
        key: 'groups',
        value: ['id1', 'id2', 'id3']
      }
    ])

    // Undefined
    mockGet.mockImplementation(() => undefined)
    await UserModel.update({ id: 'id' }, [
      {
        key: 'users',
        value: ['id1', 'id2', 'id3']
      },
      {
        key: 'groups',
        value: ['id1', 'id2', 'id3']
      }
    ])
  })

  test('del', async () => {
    mockGet.mockImplementation(() => ({
      owners: ['id'],
      users: ['id'],
      groups: ['id']
    }))
    mockUserGetWithData.mockImplementation(() => ({ id: 'id' }))
    mockGroupGet.mockImplementation(() => ({ id: 'id' }))
    await UserModel.del({ id: 'id' }, { id: 'id' })
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockUserUpdate).toHaveBeenCalledTimes(3)
    expect(mockGroupUpdate).toHaveBeenCalledTimes(1)

    // Without data
    mockGet.mockImplementation(() => undefined)
    await UserModel.del({ id: 'id' }, { id: 'id' })
    expect(mockDel).toHaveBeenCalledTimes(2)
  })
})
