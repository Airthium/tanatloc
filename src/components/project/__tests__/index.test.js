import Project from '@/components/project'
import { shallow, mount } from 'enzyme'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
    push: () => mockRouter(),
    replace: () => mockRouter()
  })
}))

jest.mock('@/components/project/view', () => 'view')
jest.mock('@/components/project/simulation', () => {
  const Simulation = () => 'simulation'
  Simulation.Selector = 'selector'
  return Simulation
})

const mockUser = jest.fn()
jest.mock('@/api/user', () => ({
  useUser: () => [mockUser(), { loadingUser: false }]
}))

const mockProject = jest.fn()
const mockMutateProject = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@/api/project', () => ({
  useProject: () => [mockProject(), { mutateProject: mockMutateProject }],
  update: async () => mockUpdate()
}))

const mockSimulations = jest.fn()
jest.mock('@/api/simulation', () => ({
  add: async () => ({ id: 'id' }),
  useSimulations: () => [mockSimulations(), { addOneSimulation: () => {} }]
}))

jest.mock('@/lib/sentry', () => ({
  captureException: () => {}
}))

let wrapper
describe('components/project', () => {
  beforeEach(() => {
    mockRouter.mockReset()

    mockUser.mockReset()
    mockUser.mockImplementation(() => ({ id: 'id' }))

    mockProject.mockReset()
    mockProject.mockImplementation(() => ({
      title: 'title',
      simulations: ['id', 'id']
    }))
    mockMutateProject.mockReset()
    mockUpdate.mockReset()

    mockSimulations.mockReset()
    mockSimulations.mockImplementation(() => [
      {
        scheme: {
          configuration: {
            part: 'part',
            geometry: {
              title: 'Geometry'
            },
            something: {
              done: true
            },
            somethingElse: {
              error: true
            }
          }
        }
      }
    ])

    wrapper = shallow(<Project />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('without configuration', () => {
    wrapper.unmount()
    mockSimulations.mockImplementation(() => [{ scheme: {} }])
    wrapper = shallow(<Project />)
    expect(wrapper).toBeDefined()
  })

  it('with subMenus', () => {
    wrapper.unmount()
    mockSimulations.mockImplementation(() => [
      {
        scheme: {
          configuration: {
            geometry: {
              title: 'Geometry',
              subMenus: [
                {
                  title: 'title1'
                },
                { title: 'title2' }
              ]
            },
            something: {
              done: true,
              subMenus: [
                {
                  title: 'title1'
                },
                { title: 'title2' }
              ]
            }
          }
        }
      }
    ])
    wrapper = shallow(<Project />)
  })

  it('Unauthorized', () => {
    wrapper.unmount()
    mockProject.mockImplementation(() => 'Unauthorized')
    wrapper = shallow(<Project />)
  })

  it('handleTitle', async () => {
    await wrapper.find('Title').props().editable.onChange('title')
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockMutateProject).toHaveBeenCalledTimes(1)

    wrapper.unmount()
    mockMutateProject.mockImplementation(() => {
      throw new Error()
    })
    wrapper = shallow(<Project />)
    await wrapper.find('Title').props().editable.onChange('title')
  })

  it('handleDashboard', () => {
    wrapper.find('Menu').at(0).props().onClick({ key: 'dashboard' })
    expect(mockRouter).toHaveBeenCalledTimes(1)
  })

  it('addSimulation', () => {
    wrapper.find('Menu').at(1).props().onClick({ key: 'new-simulation' })
    expect(wrapper.find('selector').props().visible).toBe(true)
  })

  it('selectorOk', async () => {
    await wrapper.find('selector').props().onOk({ configuration: {} })

    expect(wrapper.find('Menu').at(1).props().children[1].length).toBe(1)

    //Empty
    wrapper.unmount()
    mockProject.mockImplementation(() => ({}))
    wrapper = shallow(<Project />)
    await wrapper.find('selector').props().onOk({ configuration: {} })

    // Error
    wrapper.unmount()
    mockMutateProject.mockImplementation(() => {
      throw new Error()
    })
    wrapper = shallow(<Project />)
    await wrapper.find('selector').props().onOk({ configuration: {} })
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

  it('user effect', () => {
    wrapper.unmount()

    // With user
    wrapper = mount(<Project />)
    expect(mockRouter).toHaveBeenCalledTimes(0)
    wrapper.unmount()

    // Without user
    mockUser.mockImplementation(() => {})
    wrapper = mount(<Project />)
    expect(mockRouter).toHaveBeenCalledTimes(1)
  })
})
