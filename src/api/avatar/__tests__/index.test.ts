import Avatar from '..'

jest.mock('../add', () => ({ add: jest.fn }))

describe('api/avatar', () => {
  test('import', () => {
    expect(Avatar.add).toBeDefined()
  })
})
