import getById from '../getById'

jest.mock('../..', () => {
  let count = 0
  return async () => {
    count++
    if (count === 1) return { rows: [{ title: 'title' }] }
    return {
      rows: [{ title: 'title', avatar: 'a', owners: ['id'], users: ['id'] }]
    }
  }
})

jest.mock('../../../lib/avatar', () => ({
  readAvatar: async () => 'avatar'
}))

jest.mock('../../../lib/user', () => ({
  getUser: async () => ({
    firstname: 'firstname',
    lastname: 'lastname'
  })
}))

describe('database/project/getById', () => {
  it('standard', async () => {
    const res = await getById('id')
    expect(res).toEqual({ title: 'title' })
  })

  it('full', async () => {
    const res = await getById('id')
    expect(res).toEqual({
      title: 'title',
      avatar: 'avatar',
      owners: [{ firstname: 'firstname', lastname: 'lastname' }],
      users: [{ firstname: 'firstname', lastname: 'lastname' }]
    })
  })
})
