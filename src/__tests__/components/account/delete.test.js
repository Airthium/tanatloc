import Delete from '../../../components/account/delete'
import { shallow } from 'enzyme'

jest.mock('@/components/assets/dialog', () => ({
  DeleteDialog: 'deleteDialog'
}))

let mockMutateUser
jest.mock('@/api/user', () => ({
  useUser: () => [{}, { mutateUser: mockMutateUser }],
  del: async () => {}
}))

jest.mock('@/api/logout', () => async () => {})

jest.mock('@/lib/sentry', () => ({
  captureException: () => {}
}))

let wrapper
describe('components/account/delete', () => {
  beforeEach(() => {
    mockMutateUser = jest.fn()
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
    await wrapper.find('deleteDialog').props().onOk()
    expect(mockMutateUser).toHaveBeenCalledTimes(1)
    wrapper.unmount()

    mockMutateUser = () => {
      throw new Error()
    }
    wrapper = shallow(<Delete />)
    await wrapper.find('deleteDialog').props().onOk()
  })
})
