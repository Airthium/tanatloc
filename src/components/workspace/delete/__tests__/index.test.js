import Delete from '@/components/workspace/delete'
import { shallow } from 'enzyme'

jest.mock('@/components/assets/dialog', () => ({
  DeleteDialog: 'deleteDialog'
}))

const mockDelOneWorkspace = jest.fn()
jest.mock('@/api/workspace', () => ({
  del: async () => {},
  useWorkspaces: () => [[], { delOneWorkspace: mockDelOneWorkspace }]
}))

jest.mock('@/lib/sentry', () => ({
  captureException: () => {}
}))

let wrapper
describe('pages/workspace/delete', () => {
  beforeEach(() => {
    mockDelOneWorkspace.mockReset()

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
    mockDelOneWorkspace.mockImplementation(() => {
      throw new Error()
    })
    wrapper = shallow(<Delete />)
    await wrapper.find('deleteDialog').props().onOk()
  })
})
