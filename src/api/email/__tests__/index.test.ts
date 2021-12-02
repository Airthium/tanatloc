import Email from '..'

jest.mock('../recover', () => ({ recover: jest.fn }))

describe('api/email', () => {
  test('import', () => {
    expect(Email.recover).toBeDefined()
  })
})
