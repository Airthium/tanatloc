import auth from '../auth'

const mockGet = jest.fn(() => ({ groups: ['id'] }))
jest.mock('@/lib/user', () => ({
  get: async () => mockGet()
}))

describe('src/route/auth', () => {
  it('authorized', async () => {
    let res

    res = await auth('id', { owners: [{ id: 'id' }] })
    expect(res).toBe(true)

    res = await auth('id', {}, { owners: [{ id: 'id' }] })
    expect(res).toBe(true)

    res = await auth('id', { owners: [{ id: 'id' }], users: [{ id: 'id' }] })
    expect(res).toBe(true)

    res = await auth('id', { users: [{ id: 'id' }] })
    expect(res).toBe(true)

    res = await auth('id', {}, { users: [{ id: 'id' }] })
    expect(res).toBe(true)

    res = await auth('id', { groups: [{ id: 'id' }] }, {})
    expect(res).toBe(true)

    res = await auth('id', {}, { groups: [{ id: 'id' }] })
    expect(res).toBe(true)
  })

  it('not authorized', async () => {
    let res

    res = await auth('id', {})
    expect(res).toBe(false)

    res = await auth('id', { owners: [{ id: 'id2' }] })
    expect(res).toBe(false)

    res = await auth('id', { owners: [{ id: 'id2' }], users: [{ id: 'id2' }] })
    expect(res).toBe(false)

    res = await auth('id', { users: [{ id: 'id2' }] })
    expect(res).toBe(false)
  })
})
