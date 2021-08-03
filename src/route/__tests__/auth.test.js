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
  test('authorized', async () => {
    let res

    res = await auth('id', { owners: ['id'] })
    expect(res).toBe(true)

    res = await auth('id', {}, { owners: ['id'] })
    expect(res).toBe(true)

    res = await auth('id', { owners: ['id'], users: ['id'] })
    expect(res).toBe(true)

    res = await auth('id', { users: ['id'] })
    expect(res).toBe(true)

    res = await auth('id', {}, { users: ['id'] })
    expect(res).toBe(true)

    mockGroupGet.mockImplementation(() => ({}))
    mockOrganizationGet.mockImplementation(() => ({ owners: ['id'] }))
    res = await auth('id', { groups: ['id'] }, {})
    expect(res).toBe(true)

    res = await auth('id', {}, { groups: ['id'] })
    expect(res).toBe(true)

    mockGroupGet.mockImplementation(() => ({}))
    mockOrganizationGet.mockImplementation(() => ({ users: ['id'] }))
    res = await auth('id', { groups: ['id'] }, {})
    expect(res).toBe(true)

    res = await auth('id', {}, { groups: ['id'] })
    expect(res).toBe(true)
  })

  test('not authorized', async () => {
    let res

    res = await auth('id', {})
    expect(res).toBe(false)

    res = await auth('id', { owners: ['id2'] })
    expect(res).toBe(false)

    res = await auth('id', { owners: ['id2'], users: ['id2'] })
    expect(res).toBe(false)

    res = await auth('id', { users: ['id2'] })
    expect(res).toBe(false)

    mockGroupGet.mockImplementation(() => ({}))
    mockOrganizationGet.mockImplementation(() => ({ owners: ['id2'] }))
    res = await auth('id', { groups: ['id'] }, {})
    expect(res).toBe(false)

    res = await auth('id', {}, { groups: ['id'] })
    expect(res).toBe(false)

    mockGroupGet.mockImplementation(() => ({}))
    mockOrganizationGet.mockImplementation(() => ({ users: ['id2'] }))
    res = await auth('id', { groups: ['id'] }, {})
    expect(res).toBe(false)

    res = await auth('id', {}, { groups: ['id'] })
    expect(res).toBe(false)
  })
})
