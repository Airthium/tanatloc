import auth from '../auth'

describe('src/route/auth', () => {
  it('authorized', () => {
    let res

    res = auth({ owners: ['id'] }, 'id')
    expect(res).toBe(true)

    res = auth({ owners: ['id'], users: ['id'] }, 'id')
    expect(res).toBe(true)

    res = auth({ users: ['id'] }, 'id')
    expect(res).toBe(true)
  })

  it('not authorized', () => {
    let res

    res = auth({}, 'id')
    expect(res).toBe(false)

    res = auth({ owners: ['id2'] }, 'id1')
    expect(res).toBe(false)

    res = auth({ owners: ['id2'], users: ['id2'] }, 'id1')
    expect(res).toBe(false)

    res = auth({ users: ['id2'] }, 'id1')
    expect(res).toBe(false)
  })
})
