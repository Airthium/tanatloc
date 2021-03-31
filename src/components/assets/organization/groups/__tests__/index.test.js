import Groups from '..'
import { shallow, mount } from 'enzyme'
import '@/config/jest/mockMatchMedia'

jest.mock('@/components/assets/group', () => {
  const Group = () => <div />
  const Delete = () => <div />

  Group.Delete = Delete
  return Group
})

const mockUserToAvatar = jest.fn()
jest.mock('@/lib/utils', () => ({
  userToAvatar: () => mockUserToAvatar()
}))

const mockGroups = jest.fn()
const mockAddOneGroup = jest.fn()
const mockMutateOneGroup = jest.fn()
const mockDelOneGroup = jest.fn()
const mockLoadingGroups = false
jest.mock('@/api/group', () => ({
  useGroups: () => [
    mockGroups(),
    {
      addOneGroup: mockAddOneGroup,
      mutateOneGroup: mockMutateOneGroup,
      delOneGroup: mockDelOneGroup,
      loadingGroups: mockLoadingGroups
    }
  ]
}))

let wrapper
describe('components/assets/organization/groups', () => {
  const organization = {
    id: 'id',
    owners: []
  }
  const swr = {
    reloadOrganizations: jest.fn()
  }

  beforeEach(() => {
    mockUserToAvatar.mockReset()

    mockGroups.mockReset()
    mockGroups.mockImplementation(() => [
      {
        id: 'id',
        name: 'name',
        users: [
          { email: 'email' },
          { firstname: 'firstname' },
          { lastname: 'lastname' }
        ]
      }
    ])

    wrapper = shallow(<Groups organization={organization} swr={swr} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('columns', () => {
    const columns = wrapper.find('Table').props().columns

    // Renders
    columns[1].render([{}])
    expect(mockUserToAvatar).toHaveBeenCalledTimes(1)

    columns[2].render(null, [{}])
  })

  it('userOptions', () => {
    wrapper.unmount()
    wrapper = mount(
      <Groups
        organization={{
          ...organization,
          owners: [
            {
              email: 'email'
            },
            {
              firstname: 'firstname'
            },
            {
              lastname: 'lastname'
            }
          ]
        }}
        swr={swr}
      />
    )
    expect(wrapper).toBeDefined()
  })
})
