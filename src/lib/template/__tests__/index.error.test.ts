import '../'

jest.mock('ejs', () => ({
  compile: () => () => 'ejs'
}))

jest.mock('../../tools', () => ({
  readFile: async () => 'readFile',
  writeFile: async () => {
    // Empty
  }
}))

jest.mock('../../plugins', () => {
  // Empty
})

jest.mock('@/templates', () => {
  // Empty
})

describe('lib/template', () => {
  test('nothingToDo', async () => {
    // Empty
  })
})
