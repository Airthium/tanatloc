import Template from '../'

jest.mock('ejs', () => ({
  compile: async () => () => 'ejs'
}))

const mockWriteFile = jest.fn()
jest.mock('../../tools', () => ({
  readFile: async () => 'readFile',
  writeFile: async () => mockWriteFile()
}))

jest.mock('../../plugins', () => ({
  serverList: () => [
    {
      key: 'key',
      category: 'Model',
      path: 'path',
      templates: ['file']
    },
    {
      category: 'HPC'
    }
  ]
}))

jest.mock('@/templates', () => ({
  key: 'file'
}))

describe('lib/template', () => {
  beforeEach(() => {
    mockWriteFile.mockReset()
  })

  test('render', async () => {
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
