import Delete from '../../../components/workspace/delete'
import { shallow } from 'enzyme'

jest.mock('../../../components/assets/dialog', () => ({
  DeleteDialog: 'deleteDialog'
}))

let mockDelOneWorkspace = jest.fn()
jest.mock('../../../../src/api/workspace', () => ({
  del: async () => {},
  useWorkspaces: () => [[], { delOneWorkspace: mockDelOneWorkspace }]
}))

let wrapper
describe('pages/workspace/delete', () => {
  beforeEach(() => {
    wrapper = shallow(<Delete workspace={{ id: 'id' }} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('toggleDialog', () => {
    const visible = wrapper.find('deleteDialog').props().visible
    wrapper.find('Button').props().onClick()
    expect(wrapper.find('deleteDialog').props().visible).toBe(!visible)
  })

  it('handleDelete', async () => {
    await wrapper.find('deleteDialog').props().onOk()
    expect(mockDelOneWorkspace).toHaveBeenCalledTimes(1)

    // Error
    wrapper.unmount()
    mockDelOneWorkspace = () => {
      throw new Error()
    }
    wrapper = shallow(<Delete />)
    await wrapper.find('deleteDialog').props().onOk()
  })
})
