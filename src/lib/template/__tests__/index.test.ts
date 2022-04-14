import Template from '../'

jest.mock('ejs', () => ({
  compile: () => () => 'ejs'
}))

jest.mock('is-electron', () => () => false)

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
      templates: [{ key: 'key', file: 'file' }]
    },
    {
      category: 'HPC'
    }
  ]
}))

jest.mock('@/templates', () => ({
  key: 'file'
}))

global.tanatloc = {}

describe('lib/template', () => {
  beforeEach(() => {
    mockWriteFile.mockReset()
  })

  test('render', async () => {
    let script: string

    // Without save
    script = await Template.render('key', {})
    expect(script).toBe('ejs')
    expect(mockWriteFile).toHaveBeenCalledTimes(0)

    // With save
    script = await Template.render(
      'key',
      {},
      { location: 'location', name: 'name' }
    )
    expect(script).toBe('ejs')
    expect(mockWriteFile).toHaveBeenCalledTimes(1)
  })

  test('render - no file', async () => {
    try {
      await Template.render('unknown key', {})
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe('Unable to find the model!')
    }
  })
})
