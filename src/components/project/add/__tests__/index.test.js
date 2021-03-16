import Add from '@/components/project/add'
import { shallow } from 'enzyme'

jest.mock('@/components/assets/dialog', () => 'dialog')

const mockAddOneProject = jest.fn()
jest.mock('@/api/project', () => ({
  useProjects: () => [[], { addOneProject: () => mockAddOneProject() }],
  add: async () => ({ id: 'id' })
}))

const mockMutateOneWorkspace = jest.fn()
jest.mock('@/api/workspace', () => ({
  useWorkspaces: () => [
    [],
    { mutateOneWorkspace: () => mockMutateOneWorkspace() }
  ]
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

let wrapper
describe('components/project/add', () => {
  beforeEach(() => {
    mockAddOneProject.mockReset()
    mockMutateOneWorkspace.mockReset()
    wrapper = shallow(<Add workspace={{ id: 'id', projects: [{}] }} />)
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
    expect(mockAddOneProject).toHaveBeenCalledTimes(1)
    expect(mockMutateOneWorkspace).toHaveBeenCalledTimes(1)

    // Error
    wrapper.unmount()
    wrapper = shallow(<Add workspace={{ id: 'id' }} />)
    await wrapper.find('dialog').props().onOk()
    expect(mockAddOneProject).toHaveBeenCalledTimes(2)
    expect(mockMutateOneWorkspace).toHaveBeenCalledTimes(1)
  })

  it('onCancel', () => {
    const visible = wrapper.find('dialog').props().visible
    wrapper.find('dialog').props().onCancel()
    expect(wrapper.find('dialog').props().visible).toBe(!visible)
  })
})
