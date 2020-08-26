import Add from '../../../components/project/add'
import { shallow } from 'enzyme'

jest.mock('../../../components/assets/dialog', () => 'dialog')

const mockMutateProjects = jest.fn()
jest.mock('../../../../src/api/project', () => ({
  useProjects: () => [[], { mutateProjects: () => mockMutateProjects() }],
  add: async () => ({ id: 'id' })
}))

let mockWorkspaces = () => [
  { id: 'id', projects: [] },
  { id: 'id2', projects: [] }
]
const mockMutateWorkspaces = jest.fn()
jest.mock('../../../../src/api/workspace', () => ({
  useWorkspaces: () => [
    mockWorkspaces(),
    { mutateWorkspaces: () => mockMutateWorkspaces() }
  ]
}))

let wrapper
describe('renderer/components/project/add', () => {
  beforeEach(() => {
    mockMutateProjects.mockReset()
    mockWorkspaces = () => [
      { id: 'id', projects: [] },
      { id: 'id2', projects: [] }
    ]
    mockMutateWorkspaces.mockReset()
    wrapper = shallow(<Add workspace={{ id: 'id' }} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('without props', () => {
    wrapper.unmount()
    wrapper = shallow(<Add />)
    expect(wrapper).toBeDefined()
  })

  it('toggleDialog', () => {
    const visible = wrapper.find('dialog').props().visible
    wrapper.find('Button').props().onClick()
    expect(wrapper.find('dialog').props().visible).toBe(!visible)
  })

  it('onOk', async () => {
    await wrapper.find('dialog').props().onOk()
    expect(mockMutateProjects).toHaveBeenCalledTimes(1)
    expect(mockMutateWorkspaces).toHaveBeenCalledTimes(1)

    // Error
    wrapper.unmount()
    mockWorkspaces = () => [{ id: 'id' }]
    wrapper = shallow(<Add workspace={{ id: 'id' }} />)
    await wrapper.find('dialog').props().onOk()
    expect(mockMutateProjects).toHaveBeenCalledTimes(2)
    expect(mockMutateWorkspaces).toHaveBeenCalledTimes(1)
  })

  it('onCancel', () => {
    const visible = wrapper.find('dialog').props().visible
    wrapper.find('dialog').props().onCancel()
    expect(wrapper.find('dialog').props().visible).toBe(!visible)
  })
})
