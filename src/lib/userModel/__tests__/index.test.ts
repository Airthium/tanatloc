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

  test('get', async () => {
    mockGet.mockImplementation(() => ({}))
    await UserModel.getWithData('id', ['model', 'template'])
    expect(mockGet).toHaveBeenCalledTimes(1)

    await UserModel.getWithData('id', [
      'model',
      'template',
      'owners',
      'users',
      'groups'
    ])
    expect(mockGet).toHaveBeenCalledTimes(2)
  })

  test('update', async () => {
    mockUserGet.mockImplementation(() => ({ usermodels: [] }))
    mockGroupGet.mockImplementation(() => ({ usermodels: [] }))
    await UserModel.update({ id: 'id' }, [
      {
        key: 'key',
        value: 'value'
      }
    ])
    expect(mockUpdate).toHaveBeenCalledTimes(1)

    // With users and groups
    mockGet.mockImplementation(() => ({ users: ['id0'], groups: ['id0'] }))
    mockUserGet
      .mockImplementationOnce(() => ({ usermodels: [] }))
      .mockImplementationOnce(() => ({ usermodels: ['id'] }))
      .mockImplementationOnce(() => ({ usermodels: ['id1'] }))
    mockGroupGet
      .mockImplementationOnce(() => ({ usermodels: [] }))
      .mockImplementationOnce(() => ({ usermodels: ['id'] }))
      .mockImplementationOnce(() => ({ usermodels: ['id1'] }))
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
    mockGet.mockImplementation(() => ({ owners: [], users: [], groups: [] }))
    await UserModel.del({ id: 'id' }, { id: 'id' })
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)

    // With users and groups
    mockGet.mockImplementation(() => ({
      owners: ['id'],
      users: ['id'],
      groups: ['id']
    }))
    await UserModel.del({ id: 'id' }, { id: 'id' })
    expect(mockDel).toHaveBeenCalledTimes(2)
    expect(mockUserUpdate).toHaveBeenCalledTimes(3)
    expect(mockGroupUpdate).toHaveBeenCalledTimes(1)
  })
})
