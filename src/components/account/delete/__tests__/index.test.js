import Delete from '..'
import { shallow } from 'enzyme'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('@/components/assets/dialog', () => {
  const DeleteDialog = () => <div />
  return { DeleteDialog }
})

const mockDel = jest.fn()
jest.mock('@/api/user', () => ({
  del: async () => mockDel()
}))

const mockLogout = jest.fn()
jest.mock('@/api/logout', () => async () => mockLogout())

let wrapper
describe('components/account/delete', () => {
  const mutateUser = jest.fn()
  const swr = {
    mutateUser
  }

  beforeEach(() => {
    mockError.mockReset()

    mockDel.mockReset()

    mockLogout.mockReset()

    wrapper = shallow(<Delete swr={swr} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('render', () => {
    expect(wrapper).toBeDefined()
  })

  test('visible', () => {
    const visible = wrapper.find('DeleteDialog').props().visible
    wrapper.find('Button').props().onClick()
    expect(wrapper.find('DeleteDialog').props().visible).toBe(!visible)

    wrapper.find('DeleteDialog').props().onCancel()
    expect(wrapper.find('DeleteDialog').props().visible).toBe(visible)
  })

  test('handleDelete', async () => {
    // Normal
    await wrapper.find('DeleteDialog').props().onOk()
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockLogout).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    wrapper.unmount()

    // Error
    mockDel.mockImplementation(() => {
      throw new Error()
    })
    wrapper = shallow(<Delete swr={swr} />)
    await wrapper.find('DeleteDialog').props().onOk()
    expect(mockDel).toHaveBeenCalledTimes(2)
    expect(mockLogout).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })
})
