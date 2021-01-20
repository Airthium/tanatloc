import Data from '@/components/project/data'

describe('src/components/project/data', () => {
  it('empty', () => {
    const data = Data()
    expect(data).toBe(null)
  })

  it('avatar', () => {
    const data = Data({
      id: 'id',
      owners: [
        { id: 'id1', avatar: 'avatar', email: 'email' },
        {
          id: 'id2',
          email: 'email',
          firstname: 'firstname',
          lastname: 'lastname'
        }
      ],
      users: [
        { id: 'id1', avatar: 'avatar', email: 'email' },
        {
          id: 'id2',
          email: 'email',
          firstname: 'firstname',
          lastname: 'lastname'
        }
      ]
    })
    expect(data).toBeDefined()
  })

  it('full', () => {
    const data = Data({
      id: 'id',
      avatar: 'avatar',
      owners: [
        { id: 'id1', email: 'email' },
        {
          id: 'id2',
          email: 'email',
          firstname: 'firstname',
          lastname: 'lastname'
        }
      ],
      users: [
        { id: 'id1', email: 'email' },
        {
          id: 'id2',
          email: 'email',
          firstname: 'firstname',
          lastname: 'lastname'
        }
      ]
    })
    expect(data).toBeDefined()
  })

  it('filter', () => {
    const data = Data(
      {
        title: 'title'
      },
      'not'
    )
    expect(data).toBe(null)
  })
})
