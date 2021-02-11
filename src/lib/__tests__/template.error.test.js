import Template from '../template'

jest.mock('ejs', () => ({
  compile: async () => () => 'ejs'
}))

jest.mock('../tools', () => ({
  readFile: async () => 'readFile',
  writeFile: async () => {}
}))

jest.mock('@/templates', () => {})

jest.mock('@/plugins/templates', () => {})

describe('src/lib/template', () => {
  it('nothingToDo', async () => {})
})
