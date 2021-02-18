import Users from '..'
import { shallow } from 'enzyme'

const mockUsers = jest.fn()
const mockAddOneUser = jest.fn()
const mockMutateOneUser = jest.fn()
const mockDelOneUser = jest.fn()
const mockAdd = jest.fn()
const mockUpdateById = jest.fn()
const mockDelById = jest.fn()
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
  updateById: async () => mockUpdateById(),
  delById: async () => mockDelById()
}))

jest.mock('@/components/assets/input', () => ({
  PasswordItem: 'passwordItem'
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
    mockUpdateById.mockReset()
    mockDelById.mockReset()

    mockError.mockReset()

    wrapper = shallow(<Users />)
  })

  it('exists', () => {
    expect(wrapper).toBeDefined()
  })

  it('onAdd', async () => {
    // Open form
    wrapper.find('Button').props().onClick()
    wrapper.update()

    // Normal
    mockAdd.mockImplementation(() => ({
      alreadyExists: false
    }))
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockUpdateById).toHaveBeenCalledTimes(1)
    expect(mockAddOneUser).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Open form
    wrapper.find('Button').props().onClick()
    wrapper.update()

    // Already exists
    mockAdd.mockImplementation(() => ({
      alreadyExists: true
    }))
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockUpdateById).toHaveBeenCalledTimes(1)
    expect(mockAddOneUser).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
    expect(mockAdd).toHaveBeenCalledTimes(3)
    expect(mockUpdateById).toHaveBeenCalledTimes(1)
    expect(mockAddOneUser).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)

    // Close form
    wrapper.find('Button').at(1).props().onClick()
  })

  it('onUpdate', async () => {
    // Open form
    const actions = wrapper.find('Table').props().columns[5].render('text', {})
    actions.props.children[0].props.onClick()
    wrapper.update()

    // Normal
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({
      key: 'value',
      password: '******'
    })
    expect(mockUpdateById).toHaveBeenCalledTimes(1)
    expect(mockMutateOneUser).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Open form
    actions.props.children[0].props.onClick()
    wrapper.update()

    // Normal with password
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({
      key: 'value',
      password: 'password'
    })
    expect(mockUpdateById).toHaveBeenCalledTimes(2)
    expect(mockMutateOneUser).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Open form
    actions.props.children[0].props.onClick()
    wrapper.update()

    // Error
    mockUpdateById.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
    expect(mockUpdateById).toHaveBeenCalledTimes(3)
    expect(mockMutateOneUser).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
  })

  it('onDelete', async () => {
    // Actions
    const actions = wrapper.find('Table').props().columns[5].render('text', {})

    // Normal
    await actions.props.children[1].props.onClick()
    expect(mockDelById).toHaveBeenCalledTimes(1)
    expect(mockDelOneUser).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    //Error
    mockDelById.mockImplementation(() => {
      throw new Error()
    })
    await actions.props.children[1].props.onClick()
    expect(mockDelById).toHaveBeenCalledTimes(2)
    expect(mockDelOneUser).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })

  it('columns', () => {
    const firstName = wrapper.find('Table').props().columns[0]
    firstName.sorter('1', '2')

    const lastName = wrapper.find('Table').props().columns[1]
    lastName.sorter('1', '2')

    const email = wrapper.find('Table').props().columns[2]
    email.sorter('1', '2')

    const password = wrapper.find('Table').props().columns[3]
    expect(password.render()).toBe('******')

    const admin = wrapper.find('Table').props().columns[4]
    const superuser = admin.render(true)
    expect(superuser.props).toEqual({ style: { color: 'green' } })
    expect(admin.render(false)).toBe(false)
  })
})
