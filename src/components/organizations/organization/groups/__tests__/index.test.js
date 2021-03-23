import Groups from '..'
import { shallow } from 'enzyme'

jest.mock('../add', () => {
  const Add = () => <div />
  return Add
})

jest.mock('../edit', () => {
  const Edit = () => <div />
  return Edit
})

jest.mock('../delete', () => {
  const Delete = () => <div />
  return Delete
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
describe('components/organizations/organization/groups', () => {
  const organization = {}
  const swr = {}

  beforeEach(() => {
    mockUserToAvatar.mockReset()

    mockGroups.mockReset()
    mockGroups.mockImplementation(() => [{ id: 'id' }])

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

    columns[2].render()
  })
})
