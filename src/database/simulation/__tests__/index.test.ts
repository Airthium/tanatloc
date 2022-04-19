import Simulation from '..'

jest.mock('../add', () => ({
  add: jest.fn
}))
jest.mock('../get', () => ({
  get: jest.fn
}))
jest.mock('../getAll', () => ({
  getAll: jest.fn
}))
jest.mock('../update', () => ({
  update: jest.fn
}))
jest.mock('../del', () => ({
  del: jest.fn
}))

describe('src/database/group', () => {
  test('exists', () => {
    expect(Simulation.add).toBeDefined()
    expect(Simulation.get).toBeDefined()
    expect(Simulation.getAll).toBeDefined()
    expect(Simulation.update).toBeDefined()
    expect(Simulation.del).toBeDefined()
  })
})
