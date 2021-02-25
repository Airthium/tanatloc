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

const mockMutateOneProject = jest.fn()
const mockProjectUpdate = jest.fn()
jest.mock('@/api/project', () => ({
  useProjects: () => [[], { mutateOneProject: mockMutateOneProject }],
  update: async () => mockProjectUpdate()
}))

let wrapper
describe('src/components/project/share', () => {
  const workspace = {}
  const project = {}

  beforeEach(() => {
    mockError.mockReset()

    mockGroups.mockReset()
    mockGroups.mockImplementation(() => [])

    mockMutateOneProject.mockReset()
    mockProjectUpdate.mockReset()

    wrapper = shallow(<Share workspace={workspace} project={project} />)
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
    expect(mockProjectUpdate).toHaveBeenCalledTimes(1)
    expect(mockMutateOneProject).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockProjectUpdate.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('dialog').props().onOk()
    expect(mockProjectUpdate).toHaveBeenCalledTimes(2)
    expect(mockMutateOneProject).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)

    // Cancel
    wrapper.find('dialog').props().onCancel()
  })

  it('with groups', () => {
    wrapper.unmount()
    mockGroups.mockImplementation(() => [{}])
    wrapper = shallow(<Share workspace={workspace} project={project} />)
    expect(wrapper).toBeDefined()
  })

  it('with project groups', () => {
    wrapper.unmount()
    wrapper = shallow(
      <Share workspace={workspace} project={{ ...project, groups: [{}] }} />
    )
    expect(wrapper).toBeDefined()
  })
})
