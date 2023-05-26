import Template, { loadTemplates } from '../'

jest.mock('path', () => ({
  join: jest.fn
}))

jest.mock('ejs', () => ({
  compile: () => () => 'compile',
  render: () => 'render'
}))

const mockElectron = jest.fn()
jest.mock('is-electron', () => () => mockElectron())

const mockUserGet = jest.fn()
jest.mock('../../user', () => ({
  getWithData: async () => mockUserGet()
}))

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

jest.mock('@/templates/tools', () => ({
  indent: jest.fn()
}))

describe('lib/template', () => {
  beforeEach(() => {
    mockElectron.mockReset()

    mockUserGet.mockReset()

    mockReadFile.mockReset()
    mockWriteFile.mockReset()
  })

  test('loadTemplates', async () => {
    mockReadFile.mockImplementation(() => 'readFile')
    let templates = await loadTemplates()
    expect(templates['key']()).toBe('compile')

    // Electron
    mockElectron.mockImplementation(() => true)
    templates = await loadTemplates()
    expect(templates['key']()).toBe('compile')
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
    script = await Template.render('key', undefined, {})
    expect(script).toBe('ejs')
    expect(mockWriteFile).toHaveBeenCalledTimes(0)

    // With save
    script = await Template.render(
      'key',
      undefined,
      {},
      { location: 'location', name: 'name' }
    )
    expect(script).toBe('ejs')
    expect(mockWriteFile).toHaveBeenCalledTimes(1)

    // No file
    try {
      await Template.render('unknown key', undefined, {})
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('Unable to find the model!')
    }

    // User
    mockUserGet.mockImplementation(() => ({
      usermodels: [{ model: { algorithm: 'key' }, template: 'template' }]
    }))
    script = await Template.render(
      'key',
      'id',
      {},
      { location: 'location', name: 'name' }
    )
    expect(script).toBe('render')

    // Electron
    mockElectron.mockImplementation(() => true)
    mockUserGet.mockImplementation(() => ({
      usermodels: [{ model: { algorithm: 'key' }, template: 'template' }]
    }))
    script = await Template.render(
      'key',
      'id',
      {},
      { location: 'location', name: 'name' }
    )
    expect(script).toBe('render')

    // User, unknow key
    try {
      await Template.render(
        'unknown key',
        'id',
        {},
        { location: 'location', name: 'name' }
      )
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('Unable to find the model!')
    }
  })
})
