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
  it('encryptSession', () => {
    const res = iron.encryptSession()
    expect(res).toBe('seal')
  })

  it('getSession', async () => {
    const res = await iron.getSession({})
    expect(res).toBe('unseal')
  })
})
