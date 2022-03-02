import { SuccessNotification, ErrorNotification } from '..'

jest.mock('../success', () => () => <div />)

jest.mock('../error', () => () => <div />)

describe('components/assets/notification', () => {
  test('import', () => {
    expect(SuccessNotification).toBeDefined()
    expect(ErrorNotification).toBeDefined()
  })
})
