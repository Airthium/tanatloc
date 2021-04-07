import auth from '../auth'

const mockGroupGet = jest.fn()
jest.mock('@/lib/group', () => ({
  get: async () => mockGroupGet()
}))

const mockOrganizationGet = jest.fn()
jest.mock('@/lib/organization', () => ({
  get: async () => mockOrganizationGet()
}))

describe('route/auth', () => {
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

    mockGroupGet.mockImplementation(() => ({}))
    mockOrganizationGet.mockImplementation(() => ({ owners: ['id'] }))
    res = await auth('id', { groups: [{ id: 'id' }] }, {})
    expect(res).toBe(true)

    res = await auth('id', {}, { groups: [{ id: 'id' }] })
    expect(res).toBe(true)

    mockGroupGet.mockImplementation(() => ({}))
    mockOrganizationGet.mockImplementation(() => ({ users: ['id'] }))
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

    mockGroupGet.mockImplementation(() => ({}))
    mockOrganizationGet.mockImplementation(() => ({ owners: ['id2'] }))
    res = await auth('id', { groups: [{ id: 'id' }] }, {})
    expect(res).toBe(false)

    res = await auth('id', {}, { groups: [{ id: 'id' }] })
    expect(res).toBe(false)

    mockGroupGet.mockImplementation(() => ({}))
    mockOrganizationGet.mockImplementation(() => ({ users: ['id2'] }))
    res = await auth('id', { groups: [{ id: 'id' }] }, {})
    expect(res).toBe(false)

    res = await auth('id', {}, { groups: [{ id: 'id' }] })
    expect(res).toBe(false)
  })
})
