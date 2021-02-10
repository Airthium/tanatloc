import Add from '@/components/workspace/add'
import { shallow } from 'enzyme'

jest.mock('@/components/assets/dialog', () => 'dialog')

const mockAddOneWorkspace = jest.fn()
jest.mock('@/api/workspace', () => ({
  add: async () => ({ id: 'id' }),
  useWorkspaces: () => [[], { addOneWorkspace: mockAddOneWorkspace }]
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

let wrapper
describe('components/workspace/add', () => {
  beforeEach(() => {
    mockAddOneWorkspace.mockReset()

    wrapper = shallow(<Add />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('toggleDialog', () => {
    const visible = wrapper.find('dialog').props().visible
    wrapper.find('Button').props().onClick()
    expect(wrapper.find('dialog').props().visible).toBe(!visible)
  })

  it('onOk', async () => {
    await wrapper.find('dialog').props().onOk()
    expect(mockAddOneWorkspace).toHaveBeenCalledTimes(1)

    // Error
    wrapper.unmount()
    mockAddOneWorkspace.mockImplementation(() => {
      throw new Error()
    })
    wrapper = shallow(<Add />)
    await wrapper.find('dialog').props().onOk()
  })

  it('onCancel', () => {
    const visible = wrapper.find('dialog').props().visible
    wrapper.find('dialog').props().onCancel()
    expect(wrapper.find('dialog').props().visible).toBe(!visible)
  })
})
