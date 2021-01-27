import Delete from '..'
import { shallow } from 'enzyme'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('@/components/assets/dialog', () => ({
  DeleteDialog: 'deleteDialog'
}))

const mockMutateUser = jest.fn()
const mockDel = jest.fn()
jest.mock('@/api/user', () => ({
  useUser: () => [{}, { mutateUser: mockMutateUser }],
  del: async () => mockDel()
}))

const mockLogout = jest.fn()
jest.mock('@/api/logout', () => async () => mockLogout())

let wrapper
describe('components/account/delete', () => {
  beforeEach(() => {
    mockError.mockReset()

    mockMutateUser.mockReset()
    mockDel.mockReset()

    mockLogout.mockReset()

    wrapper = shallow(<Delete />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('visible', () => {
    const visible = wrapper.find('deleteDialog').props().visible
    wrapper.find('Button').props().onClick()
    expect(wrapper.find('deleteDialog').props().visible).toBe(!visible)

    wrapper.find('deleteDialog').props().onCancel()
    expect(wrapper.find('deleteDialog').props().visible).toBe(visible)
  })

  it('handleDelete', async () => {
    // Normal
    await wrapper.find('deleteDialog').props().onOk()
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockLogout).toHaveBeenCalledTimes(1)
    expect(mockMutateUser).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    wrapper.unmount()

    // Error
    mockMutateUser.mockImplementation(() => {
      throw new Error()
    })
    wrapper = shallow(<Delete />)
    await wrapper.find('deleteDialog').props().onOk()
    expect(mockDel).toHaveBeenCalledTimes(2)
    expect(mockLogout).toHaveBeenCalledTimes(2)
    expect(mockMutateUser).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
  })
})
