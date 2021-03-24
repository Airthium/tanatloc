import Groups from '..'
import { shallow, mount } from 'enzyme'

import '@/config/jest/mockMatchMedia'

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
const mockLoadingGroups = jest.fn()
jest.mock('@/api/group', () => ({
  useGroups: () => [
    mockGroups(),
    {
      addOneGroup: mockAddOneGroup,
      mutateOneGroup: mockMutateOneGroup,
      delOneGroup: mockDelOneGroup,
      loadingGroups: mockLoadingGroups()
    }
  ]
}))

let wrapper
describe('components/administration/groups', () => {
  const users = []

  beforeEach(() => {
    mockUserToAvatar.mockReset()

    mockGroups.mockReset()
    mockGroups.mockImplementation(() => [{ id: 'id', users: [{}] }])
    mockAddOneGroup.mockReset()
    mockMutateOneGroup.mockReset()
    mockDelOneGroup.mockReset()
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
  })
})
