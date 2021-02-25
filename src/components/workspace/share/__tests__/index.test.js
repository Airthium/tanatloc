import Share from '..'
import { shallow } from 'enzyme'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('@/components/assets/dialog', () => 'dialog')

const mockGroups = jest.fn()
jest.mock('@/api/group', () => ({
  useGroups: () => [mockGroups()]
}))

const mockMutateOneWorkspace = jest.fn()
const mockWorkspaceUpdate = jest.fn()
jest.mock('@/api/workspace', () => ({
  useWorkspaces: () => [[], { mutateOneWorkspace: mockMutateOneWorkspace }],
  update: async () => mockWorkspaceUpdate()
}))

let wrapper
describe('src/components/workspace/share', () => {
  const workspace = {}

  beforeEach(() => {
    mockError.mockReset()

    mockGroups.mockReset()
    mockGroups.mockImplementation(() => [])

    mockMutateOneWorkspace.mockReset()
    mockWorkspaceUpdate.mockReset()

    wrapper = shallow(<Share workspace={workspace} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('setvisible', () => {
    wrapper.find('Button').props().onClick()
    expect(wrapper.find('dialog').props().visible).toBe(true)
  })

  it('onChange', () => {
    wrapper.find('ForwardRef(InternalSelect)').props().onChange()
  })

  it('onShare', async () => {
    // Normal
    await wrapper.find('dialog').props().onOk()
    expect(mockWorkspaceUpdate).toHaveBeenCalledTimes(1)
    expect(mockMutateOneWorkspace).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockWorkspaceUpdate.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('dialog').props().onOk()
    expect(mockWorkspaceUpdate).toHaveBeenCalledTimes(2)
    expect(mockMutateOneWorkspace).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)

    // Cancel
    wrapper.find('dialog').props().onCancel()
  })

  it('with groups', () => {
    wrapper.unmount()
    mockGroups.mockImplementation(() => [{}])
    wrapper = shallow(<Share workspace={workspace} />)
    expect(wrapper).toBeDefined()
  })

  it('with workspace groups', () => {
    wrapper.unmount()
    wrapper = shallow(<Share workspace={{ ...workspace, groups: [{}] }} />)
    expect(wrapper).toBeDefined()
  })
})
