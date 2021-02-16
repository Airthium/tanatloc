import Users from '..'
import { shallow } from 'enzyme'

const mockUsers = jest.fn()
const mockAddOneUser = jest.fn()
const mockMutateOneUser = jest.fn()
const mockDelOneUser = jest.fn()
const mockAdd = jest.fn()
const mockUpdateOther = jest.fn()
const mockDelOther = jest.fn()
jest.mock('@/api/user', () => ({
  useUsers: () => [
    mockUsers(),
    {
      addOneUser: mockAddOneUser,
      mutateOneUser: mockMutateOneUser,
      delOneUser: mockDelOneUser
    }
  ],
  add: async () => mockAdd(),
  updateOther: async () => mockUpdateOther(),
  delOther: async () => mockDelOther()
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

let wrapper
describe('src/components/administration/users', () => {
  beforeEach(() => {
    mockUsers.mockReset()
    mockUsers.mockImplementation(() => [{ id: 'id', superuser: true }])
    mockAddOneUser.mockReset()
    mockMutateOneUser.mockReset()
    mockDelOneUser.mockReset()
    mockAdd.mockReset()
    mockUpdateOther.mockReset()
    mockDelOther.mockReset()

    mockError.mockReset()

    wrapper = shallow(<Users />)
  })

  it('exists', () => {
    expect(wrapper).toBeDefined()
  })
})
