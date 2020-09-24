import Project from '../../../components/project'
import { shallow, mount } from 'enzyme'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
    push: () => {},
    replace: () => mockRouter()
  })
}))

jest.mock('../../../components/project/view', () => 'view')

let mockUser
jest.mock('../../../../src/api/user', () => ({
  useUser: () => [mockUser(), { loadingUser: false }]
}))

let mockProject
let mockMutateProject
const mockUpdate = jest.fn()
jest.mock('../../../../src/api/project', () => ({
  useProject: () => [mockProject(), { mutateProject: mockMutateProject }],
  update: async () => mockUpdate()
}))

jest.mock('../../../../src/lib/sentry', () => ({
  captureException: () => {}
}))

let wrapper
describe('components/project', () => {
  beforeEach(() => {
    mockRouter.mockReset()
    mockUser = () => ({ id: 'id' })
    mockProject = () => ({ title: 'title' })
    mockMutateProject = jest.fn()
    mockUpdate.mockReset()
    wrapper = shallow(<Project />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('handleTitle', async () => {
    await wrapper.find('Title').props().editable.onChange('title')
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockMutateProject).toHaveBeenCalledTimes(1)

    wrapper.unmount()
    mockMutateProject = () => {
      throw new Error()
    }
    wrapper = shallow(<Project />)
    await wrapper.find('Title').props().editable.onChange('title')
  })

  it('buttons', () => {
    wrapper.find('Button').forEach((button) => {
      button.props().onClick()
    })

    // One a simulation is added
    wrapper.find('Button').forEach((button) => {
      button.props().onClick()
    })
  })

  it('user effect', () => {
    wrapper.unmount()

    // With user
    wrapper = mount(<Project />)
    expect(mockRouter).toHaveBeenCalledTimes(0)
    wrapper.unmount()

    // Without user
    mockUser = () => {}
    wrapper = mount(<Project />)
    expect(mockRouter).toHaveBeenCalledTimes(1)
  })
})
