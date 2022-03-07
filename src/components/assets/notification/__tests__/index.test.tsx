import { SuccessNotification, ErrorNotification, FormError } from '..'

jest.mock('../success', () => () => <div />)

jest.mock('../error', () => () => <div />)

jest.mock('../form', () => ({
  FormError: () => <div />
}))

describe('components/assets/notification', () => {
  test('import', () => {
    expect(SuccessNotification).toBeDefined()
    expect(ErrorNotification).toBeDefined()
    expect(FormError).toBeDefined()
  })
})
