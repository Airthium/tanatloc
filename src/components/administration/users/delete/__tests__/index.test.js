import Delete from '..'
import { shallow } from 'enzyme'

jest.mock('@/components/assets/dialog', () => {
  const DeleteDialog = () => <div />
  return { DeleteDialog }
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockDelById = jest.fn()
jest.mock('@/api/user', () => ({
  delById: async () => mockDelById()
}))

let wrapper
describe('components/administration/users/delete', () => {
  const user = { id: 'id' }
  const delOneUser = jest.fn()
  const swr = { delOneUser }

  beforeEach(() => {
    mockError.mockReset()

    mockDelById.mockReset()

    wrapper = shallow(<Delete user={user} swr={swr} />)
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
    wrapper.find('DeleteDialog').props().onCancel()
  })

  it('onDelete', async () => {
    // Normal
    await wrapper.find('DeleteDialog').props().onOk()
    expect(mockDelById).toHaveBeenCalledTimes(1)
    expect(delOneUser).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockDelById.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('DeleteDialog').props().onOk()
    expect(mockDelById).toHaveBeenCalledTimes(2)
    expect(delOneUser).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })
})
