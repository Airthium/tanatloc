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
describe('components/organizations/organization/users', () => {
  const organization = {
    owners: [{ id: 'id' }, {}],
    users: [{ id: 'id' }, {}]
  }
  const mutateOneOrganization = jest.fn()
  const loadingOrganizations = false
  const swr = {
    mutateOneOrganization,
    loadingOrganizations
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

  it('columns', () => {
    const ownersColumns = wrapper.find('Table').at(0).props().columns
    ownersColumns[0].render()
    expect(mockUserToAvatar).toHaveBeenCalledTimes(1)

    ownersColumns[4].render()

    const usersColumns = wrapper.find('Table').at(1).props().columns
    usersColumns[0].render()
    expect(mockUserToAvatar).toHaveBeenCalledTimes(2)

    usersColumns[4].render()
  })
})
