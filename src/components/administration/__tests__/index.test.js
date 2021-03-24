import Administration from '..'
import { shallow } from 'enzyme'

const mockReplace = jest.fn()
const mockQuery = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    replace: () => mockReplace(),
    query: mockQuery()
  })
}))

jest.mock('../users', () => {
  const Users = () => <div />
  return Users
})
jest.mock('../groups', () => {
  const Groups = () => <div />
  return Groups
})
jest.mock('../registration', () => {
  const Registration = () => <div />
  return Registration
})

const mockUsers = jest.fn()
const mockAddOneUser = jest.fn()
const mockMutateOneUser = jest.fn()
const mockdDelOneUser = jest.fn()
jest.mock('@/api/user', () => ({
  useUsers: () => [
    mockUsers(),
    {
      addOneUser: mockAddOneUser,
      mutateOneUser: mockMutateOneUser,
      delOneUser: mockdDelOneUser
    }
  ]
}))

let wrapper
describe('components/administration', () => {
  beforeEach(() => {
    mockReplace.mockReset()
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({ tab: 'tab' }))

    mockUsers.mockReset()
    mockAddOneUser.mockReset()
    mockMutateOneUser.mockReset()
    mockdDelOneUser.mockReset()

    wrapper = shallow(<Administration />)
  })

  it('exists', () => {
    expect(wrapper).toBeDefined()
  })

  it('onChange', () => {
    wrapper.find('Tabs').props().onChange()
    expect(mockReplace).toHaveBeenCalledTimes(1)
  })

  it('without query', () => {
    wrapper.unmount()
    mockQuery.mockImplementation(() => ({}))
    wrapper = shallow(<Administration />)
  })
})
