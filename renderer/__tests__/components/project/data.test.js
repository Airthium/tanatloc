import Data from '../../../components/project/data'

describe('renderer/components/project/data', () => {
  it('empty', () => {
    const data = Data()
    expect(data).toBe(null)
  })

  it('without avatar', () => {
    const data = Data({
      id: 'id',
      owners: [
        { id: 'id1' },
        { id: 'id2', firstname: 'firstname', lastname: 'lastname' }
      ],
      users: [
        { id: 'id1' },
        { id: 'id2', firstname: 'firstname', lastname: 'lastname' }
      ]
    })
    expect(data).toBeDefined()
  })

  it('full', () => {
    const data = Data({
      id: 'id',
      avatar: 'avatar',
      owners: [
        { id: 'id1' },
        { id: 'id2', firstname: 'firstname', lastname: 'lastname' }
      ],
      users: [
        { id: 'id1' },
        { id: 'id2', firstname: 'firstname', lastname: 'lastname' }
      ]
    })
    expect(data).toBeDefined()
  })
})
