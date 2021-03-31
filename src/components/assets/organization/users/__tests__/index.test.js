import Users from '..'
import { shallow } from 'enzyme'

jest.mock('../add', () => {
  const Add = () => <div />
  return Add
})

jest.mock('../delete', () => {
  const Delete = () => <div />
  return Delete
})

const mockUserToAvatar = jest.fn()
jest.mock('@/lib/utils', () => ({
  userToAvatar: () => mockUserToAvatar()
}))

let wrapper
describe('components/assets/organization/users', () => {
  const organization = {
    id: 'id',
    owners: [{}]
  }
  const swr = {
    mutateOneOrganization: jest.fn(),
    loadingOrganizations: jest.fn()
  }

  beforeEach(() => {
    mockUserToAvatar.mockReset()

    wrapper = shallow(<Users organization={organization} swr={swr} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('with users', () => {
    wrapper.unmount()
    wrapper = shallow(
      <Users
        organization={{
          ...organization,
          users: [{}]
        }}
        swr={swr}
      />
    )
    expect(wrapper).toBeDefined()
  })

  it('columns', () => {
    // Owners column
    const ownersColumns = wrapper.find('Table').at(0).props().columns

    // Renders
    ownersColumns[0].render(null, {})
    expect(mockUserToAvatar).toHaveBeenCalledTimes(1)

    ownersColumns[4].render({})

    // Users columns
    const usersColumns = wrapper.find('Table').at(1).props().columns

    // Renders
    usersColumns[0].render(null, {})
    expect(mockUserToAvatar).toHaveBeenCalledTimes(2)

    usersColumns[4].render({})
  })
})
