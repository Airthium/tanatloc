import getSessionId from '../session'

let mockSession
jest.mock('../../auth/iron', () => ({
  getSession: () => mockSession()
}))

describe('src/route/session', () => {
  const req = {}
  const res = {
    status: () => ({
      json: () => {}
    })
  }

  it('ok', async () => {
    mockSession = () => ({ id: 'id' })
    const id = await getSessionId(req, res)
    expect(id).toBe('id')
  })

  it('wrong', async () => {
    let id

    // No id
    mockSession = () => ({})
    id = await getSessionId(req, res)
    expect(id).toBe(null)

    // Empty
    mockSession = () => {}
    id = await getSessionId(req, res)
    expect(id).toBe(null)
  })
})
