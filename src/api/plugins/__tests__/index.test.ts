import Plugins from '..'

jest.mock('../list', () => ({
  list: jest.fn
}))

jest.mock('../completeList', () => ({
  completeList: jest.fn
}))

describe('api/plugins', () => {
  test('import', () => {
    expect(Plugins.completeList).toBeDefined()
    expect(Plugins.list).toBeDefined()
  })
})
