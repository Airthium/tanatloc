import Template from '../template'

jest.mock('ejs', () => ({
  compile: async () => () => 'ejs'
}))

const mockWriteFile = jest.fn()
jest.mock('../tools', () => ({
  readFile: async () => 'readFile',
  writeFile: async () => mockWriteFile()
}))

jest.mock('@/templates', () => ({
  key: 'file'
}))

jest.mock('@/plugins/templates', () => ({
  plugin: {
    key: 'key',
    path: 'path',
    templates: [{ key: 'key', file: 'file' }]
  }
}))

describe('src/lib/template', () => {
  beforeEach(() => {
    mockWriteFile.mockReset()
  })

  it('render', async () => {
    let script
    // Without save
    script = await Template.render('key', {})
    expect(script).toBe('ejs')
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    // With save
    script = await Template.render('key', {}, {})
    expect(script).toBe('ejs')
    expect(mockWriteFile).toHaveBeenCalledTimes(1)
  })
})
