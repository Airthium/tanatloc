import Geometry from '..'

jest.mock('../useGeometries', () => ({
  useGeometries: jest.fn
}))

jest.mock('../add', () => ({
  add: jest.fn
}))

jest.mock('../update', () => ({
  update: jest.fn
}))

jest.mock('../del', () => ({
  del: jest.fn
}))

jest.mock('../download', () => ({
  download: jest.fn
}))

jest.mock('../getPart', () => ({
  getPart: jest.fn
}))

describe('api/geometry', () => {
  test('import', () => {
    expect(Geometry.useGeometries).toBeDefined()
    expect(Geometry.add).toBeDefined()
    expect(Geometry.update).toBeDefined()
    expect(Geometry.del).toBeDefined()
    expect(Geometry.download).toBeDefined()
    expect(Geometry.getPart).toBeDefined()
  })
})
