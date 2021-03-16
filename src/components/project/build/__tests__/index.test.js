import Build from '@/components/project/build'

jest.mock('@/lib/utils', () => ({
  stringToColor: () => {},
  userToAvatar: () => {}
}))

describe('components/project/build', () => {
  it('empty', () => {
    const data = Build()
    expect(data).toBe(null)
  })

  it('avatar', () => {
    const data = Build({
      id: 'id',
      description: 'description',
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
    const data = Build({
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
      ],
      groups: [
        {
          id: 'id',
          name: 'name'
        }
      ]
    })
    expect(data).toBeDefined()
  })

  it('filter', () => {
    const data = Build(
      {
        title: 'title'
      },
      'not'
    )
    expect(data).toBe(null)
  })
})
