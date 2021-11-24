import * as iron from '../iron'

jest.mock('@hapi/iron', () => ({
  seal: () => 'seal',
  unseal: () => 'unseal'
}))

jest.mock('../auth-cookies', () => ({
  getTokenCookie: () => 'cookie'
}))

jest.mock('@/config/auth', () => ({
  SECRET: 'auth_secret'
}))

describe('auth/iron', () => {
  test('encryptSession', () => {
    const res = iron.encryptSession({ id: 'id' })
    expect(res).toBe('seal')
  })

  test('getSession', async () => {
    const res = await iron.getSession({})
    expect(res).toBe('unseal')
  })
})
