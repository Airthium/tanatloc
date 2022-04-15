import Template, { loadTemplates } from '../'

jest.mock('path', () => ({
  join: jest.fn
}))

jest.mock('ejs', () => ({
  compile: () => () => 'ejs'
}))

const mockElectron = jest.fn()
jest.mock('is-electron', () => () => mockElectron())

const mockReadFile = jest.fn()
const mockWriteFile = jest.fn()
jest.mock('../../tools', () => ({
  readFile: async () => mockReadFile(),
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

describe('lib/template', () => {
  beforeEach(() => {
    mockElectron.mockReset()

    mockReadFile.mockReset()
    mockWriteFile.mockReset()
  })

  test('loadTemplates', async () => {
    mockReadFile.mockImplementation(() => 'readFile')
    let templates = await loadTemplates()
    expect(templates['key']()).toBe('ejs')

    // Electron
    mockElectron.mockImplementation(() => true)
    templates = await loadTemplates()
    expect(templates['key']()).toBe('ejs')
  })

  test('render', async () => {
    Object.defineProperty(global, 'tanatloc', {
      value: {
        templates: {
          key: () => 'ejs'
        }
      }
    })

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

    // No file
    try {
      await Template.render('unknown key', {})
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('Unable to find the model!')
    }
  })
})
