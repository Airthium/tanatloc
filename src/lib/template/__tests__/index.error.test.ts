import '../'

jest.mock('ejs', () => ({
  compile: async () => () => 'ejs'
}))

jest.mock('../../tools', () => ({
  readFile: async () => 'readFile',
  writeFile: async () => {}
}))

jest.mock('../../plugins', () => {})

jest.mock('@/templates', () => {})

describe('lib/template', () => {
  test('nothingToDo', async () => {})
})