import Project from '../../../components/project'
import { shallow, mount } from 'enzyme'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
    push: () => mockRouter(),
    replace: () => mockRouter()
  })
}))

jest.mock('../../../components/project/view', () => 'view')
jest.mock('../../../components/project/simulation', () => {
  const Simulation = () => 'simulation'
  Simulation.Selector = 'selector'
  return Simulation
})

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

let mockSimulations
jest.mock('../../../../src/api/simulation', () => ({
  add: async () => ({ id: 'id' }),
  useSimulations: () => [mockSimulations(), { addOneSimulation: () => {} }]
}))

jest.mock('../../../../src/lib/sentry', () => ({
  captureException: () => {}
}))

let wrapper
describe('components/project', () => {
  beforeEach(() => {
    mockRouter.mockReset()
    mockUser = () => ({ id: 'id' })
    mockProject = () => ({ title: 'title', simulations: [{}] })
    mockMutateProject = jest.fn()
    mockUpdate.mockReset()
    mockSimulations = () => [
      {
        scheme: {
          children: [{}]
        }
      }
    ]
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

  it('dashboard', () => {
    wrapper.find('Menu').at(0).props().onClick({ key: 'dashboard' })
    expect(mockRouter).toHaveBeenCalledTimes(1)
  })

  it('add simulation', () => {
    wrapper.find('Menu').at(1).props().onClick({ key: 'new-simulation' })
    expect(wrapper.find('selector').props().visible).toBe(true)
  })

  it('selector ok', async () => {
    await wrapper
      .find('selector')
      .props()
      .onOk({ children: [{}] })

    expect(wrapper.find('Menu').at(1).props().children[1].length).toBe(1)

    // Error
    wrapper.unmount()
    mockMutateProject = () => {
      throw new Error()
    }
    wrapper = shallow(<Project />)
    await wrapper
      .find('selector')
      .props()
      .onOk({ children: [{}] })
  })

  it('selector cancel', () => {
    wrapper.find('selector').props().onCancel()
    expect(wrapper.find('selector').props().visible).toBe(false)
  })

  it('select simulation', async () => {
    // Add simulation first
    await wrapper
      .find('selector')
      .props()
      .onOk({
        children: [
          {
            type: 'geometry'
          }
        ]
      })

    wrapper.find('Menu').at(1).props().onClick({ key: 'simulation-0-geometry' })
  })

  it('unknow key', () => {
    wrapper.find('Menu').at(1).props().onClick({ key: 'unknow' })
  })

  it('simulation close', () => {
    wrapper.find('Simulation').props().onClose()
    expect(wrapper.find('Simulation').props().simulation).toBe(undefined)
  })
})
