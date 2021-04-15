import Groups from '..'
import { shallow, mount } from 'enzyme'

import '@/config/jest/mockMatchMedia'

jest.mock('@/components/assets/group', () => {
  const Group = () => <div />
  const Delete = () => <div />

  Group.Delete = Delete
  return Group
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockUserToAvatar = jest.fn()
jest.mock('@/lib/utils', () => ({
  userToAvatar: () => mockUserToAvatar()
}))

const mockGroups = jest.fn()
const mockAddOneGroup = jest.fn()
const mockMutateOneGroup = jest.fn()
const mockDelOneGroup = jest.fn()
const mockErrorGroups = jest.fn()
const mockLoadingGroups = jest.fn()
jest.mock('@/api/group', () => ({
  useGroups: () => [
    mockGroups(),
    {
      addOneGroup: mockAddOneGroup,
      mutateOneGroup: mockMutateOneGroup,
      delOneGroup: mockDelOneGroup,
      errorGroups: mockErrorGroups(),
      loadingGroups: mockLoadingGroups()
    }
  ]
}))

let wrapper
describe('components/administration/groups', () => {
  const users = []

  beforeEach(() => {
    mockError.mockReset()

    mockUserToAvatar.mockReset()

    mockGroups.mockReset()
    mockGroups.mockImplementation(() => [{ id: 'id', users: [{}] }])
    mockAddOneGroup.mockReset()
    mockMutateOneGroup.mockReset()
    mockDelOneGroup.mockReset()
    mockErrorGroups.mockReset()
    mockLoadingGroups.mockReset()

    wrapper = shallow(<Groups users={users} />)
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
    columns[2].render(null, [{}])
  })

  it('effect', () => {
    wrapper.unmount()
    wrapper = mount(
      <Groups
        users={[
          { id: 'id1', firstname: 'firstname' },
          { id: 'id2', email: 'email' }
        ]}
      />
    )
    expect(wrapper).toBeDefined()

    // Error
    wrapper.unmount()
    mockErrorGroups.mockImplementation(() => ({ message: 'Error' }))
    wrapper = mount(<Groups users={users} />)
    expect(mockError).toHaveBeenCalledTimes(2)
  })
})
