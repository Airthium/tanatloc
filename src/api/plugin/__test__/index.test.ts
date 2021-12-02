import Plugin from '..'

jest.mock('../add', () => ({
  add: jest.fn
}))

jest.mock('../update', () => ({
  update: jest.fn
}))

jest.mock('../del', () => ({
  del: jest.fn
}))

jest.mock('../usePlugins', () => ({
  usePlugins: jest.fn
}))

describe('api/plugin', () => {
  test('import', () => {
    expect(Plugin.add).toBeDefined()
    expect(Plugin.update).toBeDefined()
    expect(Plugin.del).toBeDefined()
    expect(Plugin.usePlugins).toBeDefined()
  })
})
