import Edit from '..'
import { shallow } from 'enzyme'

jest.mock('@/components/assets/dialog', () => {
  const Dialog = () => <div />
  return Dialog
})

jest.mock('@/components/assets/input', () => {
  const PasswordItem = () => <div />
  return { PasswordItem }
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('@/plugins', () => ({
  key: {
    name: 'name',
    key: 'key'
  }
}))

const mockUpdateById = jest.fn()
jest.mock('@/api/user', () => ({
  updateById: async () => mockUpdateById()
}))

let wrapper
describe('components/administration/users/edit', () => {
  const user = { id: 'id' }
  const mutateOneUser = jest.fn()
  const swr = { mutateOneUser }

  beforeEach(() => {
    mockError.mockReset()

    mockUpdateById.mockReset()

    wrapper = shallow(<Edit user={user} swr={swr} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('setVisible', () => {
    // Visible
    wrapper.find('Button').props().onClick()

    // Not visible
    wrapper.find('Dialog').props().onCancel()
  })

  it('onUpdate', async () => {
    // Normal
    await wrapper.find('Dialog').props().onOk({
      firstname: 'firstname',
      lastname: undefined,
      password: 'password',
      key: '******'
    })
    expect(mockUpdateById).toHaveBeenCalledTimes(1)
    expect(mutateOneUser).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockUpdateById.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('Dialog').props().onOk({})
    expect(mockUpdateById).toHaveBeenCalledTimes(2)
    expect(mutateOneUser).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })
})
