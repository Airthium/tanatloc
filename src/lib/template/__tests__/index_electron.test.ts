/**
 * @jest-environment node
 */

Object.defineProperty(process, 'resourcesPath', {
  value: 'resourcesPath'
})
export {}

jest.mock('ejs', () => ({
  compile: async () => () => 'ejs'
}))

jest.mock('is-electron', () => () => true)

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
      key: 'HPC',
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

  test('load', () => {
    require('..')
  })
})
