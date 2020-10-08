import auth from '../auth'

describe('src/route/auth', () => {
  it('authorized', () => {
    let res

    res = auth({ owners: [{ id: 'id' }] }, 'id')
    expect(res).toBe(true)

    res = auth({ owners: [{ id: 'id' }], users: [{ id: 'id' }] }, 'id')
    expect(res).toBe(true)

    res = auth({ users: [{ id: 'id' }] }, 'id')
    expect(res).toBe(true)
  })

  it('not authorized', () => {
    let res

    res = auth({}, 'id')
    expect(res).toBe(false)

    res = auth({ owners: [{ id: 'id2' }] }, 'id1')
    expect(res).toBe(false)

    res = auth({ owners: [{ id: 'id2' }], users: [{ id: 'id2' }] }, 'id1')
    expect(res).toBe(false)

    res = auth({ users: [{ id: 'id2' }] }, 'id1')
    expect(res).toBe(false)
  })
})
