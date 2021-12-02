import { PasswordItem } from '..'

jest.mock('../password', () => () => <div />)

describe('components/assets/input', () => {
  test('import', () => {
    expect(PasswordItem).toBeDefined()
  })
})
