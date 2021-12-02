import { Success, Error } from '..'

jest.mock('../success', () => () => <div />)

jest.mock('../error', () => () => <div />)

describe('components/assets/notification', () => {
  test('import', () => {
    expect(Success).toBeDefined()
    expect(Error).toBeDefined()
  })
})
