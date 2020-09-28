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

describe('src/lib/simulation', () => {
  beforeEach(() => {
    mockProject.mockReset()
  })

  it('add', async () => {
    const simulation = await add({}, {})
    expect(simulation).toEqual({ id: 'add' })
    expect(mockProject).toHaveBeenCalledTimes(1)
  })

  it('get', async () => {
    let simulation

    // Empty
    mockGet = () => ({})
    simulation = await get()
    expect(simulation).toEqual({})
  })

  it('update', async () => {
    await update({}, {})
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })

  it('delete', async () => {
    await del({}, {})
    expect(mockDelete).toHaveBeenCalledTimes(1)
    expect(mockProject).toHaveBeenCalledTimes(1)
  })
})
