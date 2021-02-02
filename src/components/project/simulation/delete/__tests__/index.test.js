import Delete from '@/components/project/simulation/delete'
import { shallow } from 'enzyme'

jest.mock('@/components/assets/dialog', () => ({
  DeleteDialog: 'deleteDialog'
}))

const mockMutateSimulation = jest.fn()
const mockDel = jest.fn()
jest.mock('@/api/simulation', () => ({
  useSimulations: () => [[], { delOneSimulation: mockMutateSimulation }],
  del: async () => mockDel()
}))

const mockMutateProject = jest.fn()
jest.mock('@/api/project', () => ({
  useProject: () => [{}, { mutateProject: mockMutateProject }]
}))

jest.mock('@/lib/sentry', () => ({
  captureException: () => {}
}))

let wrapper
describe('src/components/project/simulation/delete', () => {
  beforeEach(() => {
    mockMutateSimulation.mockReset()
    mockDel.mockReset()
    mockDel.mockImplementation(() => {})

    mockMutateProject.mockReset()
    wrapper = shallow(
      <Delete project={{ simulations: [{}] }} simulation={{}} />
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('toggleDialog', () => {
    const visible = wrapper.find('deleteDialog').props().visible
    wrapper.find('deleteDialog').props().onCancel()
    expect(wrapper.find('deleteDialog').props().visible).toBe(!visible)
  })

  it('handleDelete', async () => {
    await wrapper.find('deleteDialog').props().onOk()
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockMutateProject).toHaveBeenCalledTimes(1)
    expect(mockMutateSimulation).toHaveBeenCalledTimes(1)

    // Error
    mockDel.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('deleteDialog').props().onOk()
    expect(mockMutateProject).toHaveBeenCalledTimes(1)
    expect(mockMutateSimulation).toHaveBeenCalledTimes(1)
  })
})
