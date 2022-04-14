jest.mock('http', () => ({
  createServer: () => {}
}))

jest.mock('url', () => ({
  parse: () => {}
}))

jest.mock('next', () => {})

// jest.mock('../init')

describe('src/server', () => {
  test('call', () => {})
})

export {}
