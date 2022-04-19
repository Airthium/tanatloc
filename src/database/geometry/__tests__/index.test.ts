import Geometry from '..'

jest.mock('../add', () => ({
  add: jest.fn
}))
jest.mock('../get', () => ({
  get: jest.fn
}))
jest.mock('../update', () => ({
  update: jest.fn
}))
jest.mock('../del', () => ({
  del: jest.fn
}))

describe('src/database/geometry', () => {
  test('exists', () => {
    expect(Geometry.add).toBeDefined()
    expect(Geometry.get).toBeDefined()
    expect(Geometry.update).toBeDefined()
    expect(Geometry.del).toBeDefined()
  })
})
