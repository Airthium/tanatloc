import List from '..'
import { shallow } from 'enzyme'

jest.mock('../../delete', () => {
  const Delete = () => <div />
  return Delete
})

const mockUserToAvatar = jest.fn()
const mockGroupToAvatar = jest.fn()
jest.mock('@/lib/utils', () => ({
  userToAvatar: () => mockUserToAvatar(),
  groupToAvatar: () => mockGroupToAvatar()
}))

let wrapper
describe('components/organizations/list', () => {
  const user = { id: 'id1' }
  const organizations = [
    {
      name: 'Name1',
      owners: [{ id: 'id1' }],
      users: [{ id: 'id1' }],
      groups: [{ id: 'id1' }]
    },
    {
      name: 'Name2',
      owners: [{ id: 'id2' }],
      users: [{ id: 'id2' }],
      groups: [{ id: 'id2' }]
    }
  ]
  const delOneOrganization = jest.fn()
  const loadingOrganizations = false
  const swr = { delOneOrganization, loadingOrganizations }
  const setOrganization = jest.fn()

  beforeEach(() => {
    mockUserToAvatar.mockReset()
    mockGroupToAvatar.mockReset()

    wrapper = shallow(
      <List
        user={user}
        organizations={organizations}
        swr={swr}
        setOrganization={setOrganization}
      />
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('render', () => {
    expect(wrapper).toBeDefined()
  })

  test('columns', () => {
    const columns = wrapper.find('Table').props().columns

    // Sorter
    columns[0].sorter(organizations[0], organizations[1])

    // Renders
    columns[1].render(organizations[0].owners)
    expect(mockUserToAvatar).toHaveBeenCalledTimes(1)
    columns[2].render(organizations[0].users)
    expect(mockUserToAvatar).toHaveBeenCalledTimes(2)
    columns[3].render(organizations[0].groups)
    expect(mockGroupToAvatar).toHaveBeenCalledTimes(1)

    const actions = columns[4].render(organizations[0])
    const button = actions.props.children[0]
    // Set organization
    button.props.onClick()

    columns[4].render(organizations[1])
  })
})
