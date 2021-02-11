import Template from '../template'

const mockCompile = jest.fn()
jest.mock('ejs', () => ({
  compile: async () => mockCompile
}))

const mockReadFile = jest.fn()
const mockWriteFile = jest.fn()
jest.mock('../tools', () => ({
  readFile: async () => mockReadFile(),
  writeFile: async () => mockWriteFile()
}))

jest.mock('@/templates', () => ({
  key: 'file'
}))

jest.mock('@/plugins/templates', () => ({
  key: {
    templates: [{ key: 'file' }]
  }
}))

describe('src/lib/template', () => {
  beforeEach(() => {
    mockCompile.mockReset()
    mockCompile.mockImplementation(() => 'ejs')

    mockReadFile.mockReset()
    mockReadFile.mockImplementation(() => 'string')
    mockWriteFile.mockReset()
  })

  it('render', async () => {
    // let script
    // // Without save
    // script = await Template.render('key', {}, {})
    // expect(script).toBe('ejs')
    // expect(mockWriteFile).toHaveBeenCalledTimes(0)
    // // With save
    // script = await Template.render('key', {}, {}, {})
    // expect(script).toBe('ejs')
    // expect(mockWriteFile).toHaveBeenCalledTimes(1)
  })
})
