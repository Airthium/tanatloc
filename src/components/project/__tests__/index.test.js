import Project from '@/components/project'
import { shallow, mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
    push: () => mockRouter(),
    replace: () => mockRouter()
  })
}))

jest.mock('@/components/assets/button', () => ({
  GoBack: () => <div />
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('@/components/loading', () => ({
  Simple: () => <div />
}))

jest.mock('@/components/notauthorized', () => {
  const NotAuthorized = () => <div />
  return NotAuthorized
})

jest.mock('@/components/project/data', () => {
  const Data = () => <div />
  return Data
})

jest.mock('@/components/project/view', () => {
  const View = () => <div />
  return View
})

jest.mock('@/components/project/simulation', () => {
  const Simulation = () => <div />
  const Selector = () => <div />
  Simulation.Selector = Selector
  return Simulation
})

const mockUser = jest.fn()
const mockUserLoading = jest.fn()
jest.mock('@/api/user', () => ({
  useUser: () => [mockUser(), { loadingUser: mockUserLoading() }]
}))

const mockProject = jest.fn()
const mockReloadProject = jest.fn()
const mockMutateProject = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@/api/project', () => ({
  useProject: () => [
    mockProject(),
    { reloadProject: mockReloadProject, mutateProject: mockMutateProject }
  ],
  update: async () => mockUpdate()
}))

const mockSimulations = jest.fn()
const mockSimulationUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  add: async () => ({ id: 'id' }),
  update: async () => mockSimulationUpdate(),
  useSimulations: () => [
    mockSimulations(),
    {
      addOneSimulation: () => {},
      delOneSimulation: () => {},
      mutateOneSimulation: () => {}
    }
  ]
}))

let wrapper
describe('components/project', () => {
  beforeEach(() => {
    mockRouter.mockReset()

    mockError.mockReset()

    mockUser.mockReset()
    mockUser.mockImplementation(() => ({ id: 'id' }))
    mockUserLoading.mockReset()

    mockProject.mockReset()
    mockProject.mockImplementation(() => ({
      title: 'title',
      simulations: ['id', 'id']
    }))
    mockReloadProject.mockReset()
    mockMutateProject.mockReset()
    mockUpdate.mockReset()

    mockSimulationUpdate.mockReset()
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

  it('loading', () => {
    wrapper.unmount()
    mockUserLoading.mockImplementation(() => true)
    wrapper = shallow(<Project />)
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
    wrapper.find('GoBack').props().onClick()
    expect(mockRouter).toHaveBeenCalledTimes(1)
  })

  it('addSimulation', () => {
    wrapper.find('Button').props().onClick()
    expect(wrapper.find('Selector').props().visible).toBe(true)
  })

  it('selectorOk', async () => {
    await wrapper.find('Selector').props().onOk({ configuration: {} })

    expect(wrapper.find('Menu').props().children.length).toBe(6)

    //Empty
    wrapper.unmount()
    mockProject.mockImplementation(() => ({}))
    wrapper = shallow(<Project />)
    await wrapper.find('Selector').props().onOk({ configuration: {} })

    // Error
    wrapper.unmount()
    mockMutateProject.mockImplementation(() => {
      throw new Error()
    })
    wrapper = shallow(<Project />)
    await wrapper.find('Selector').props().onOk({ configuration: {} })
  })

  it('selector cancel', () => {
    wrapper.find('Selector').props().onCancel()
    expect(wrapper.find('Selector').props().visible).toBe(false)
  })

  it('select simulation', async () => {
    // Add simulation first
    await wrapper
      .find('Selector')
      .props()
      .onOk({
        children: [
          {
            type: 'geometry'
          }
        ]
      })

    wrapper
      .find('Menu')
      .props()
      .onClick({ key: 'simulation&0&geometry', keyPath: [] })
  })

  it('unknow key', () => {
    wrapper.find('Menu').props().onClick({ key: 'unknow', keyPath: [] })
  })

  it('simulation close', () => {
    wrapper.find('Simulation').props().onClose()
    expect(wrapper.find('Simulation').props().simulation).toBe(undefined)
  })

  // it('user effect', () => {
  //   wrapper.unmount()

  //   // With user
  //   wrapper = mount(<Project />)
  //   expect(mockRouter).toHaveBeenCalledTimes(0)
  //   wrapper.unmount()

  //   // Without user
  //   mockUser.mockImplementation(() => {})
  //   wrapper = mount(<Project />)
  //   expect(mockRouter).toHaveBeenCalledTimes(1)
  // })

  // it('simulation effect', () => {
  //   // Update
  //   wrapper.unmount()
  //   const mockTitle = jest.fn(() => 'title')
  //   mockSimulations.mockImplementation(() => [
  //     {
  //       id: 'id',
  //       scheme: {
  //         configuration: {
  //           geometry: {
  //             title: mockTitle(),
  //             file: {}
  //           }
  //         }
  //       }
  //     }
  //   ])
  //   wrapper = mount(<Project />)
  //   mockTitle.mockImplementation(() => 'newTitle')

  //   act(() =>
  //     wrapper
  //       .find('InternalMenu')
  //       .props()
  //       .onClick({ key: 'simulation&id&materials', keyPath: [] })
  //   )
  //   expect(mockSimulationUpdate).toHaveBeenCalledTimes(2)

  //   // Force geometry
  //   wrapper.unmount()
  //   mockSimulations.mockImplementation(() => [
  //     {
  //       id: 'id',
  //       scheme: {
  //         configuration: {
  //           geometry: {
  //             title: 'Geometry',
  //             file: {}
  //           }
  //         }
  //       }
  //     }
  //   ])
  //   wrapper = mount(<Project />)

  //   act(() =>
  //     wrapper
  //       .find('InternalMenu')
  //       .props()
  //       .onClick({ key: 'simulation&id&materials', keyPath: [] })
  //   )
  //   // wrapper.update()
  //   expect(mockSimulationUpdate).toHaveBeenCalledTimes(3)

  //   // Force geometry (with part)
  //   wrapper.unmount()
  //   mockSimulations.mockImplementation(() => [
  //     {
  //       id: 'id',
  //       scheme: {
  //         configuration: {
  //           part: {},
  //           geometry: {
  //             title: 'Geometry',
  //             file: {}
  //           }
  //         }
  //       }
  //     }
  //   ])
  //   wrapper = mount(<Project />)

  //   act(() =>
  //     wrapper
  //       .find('InternalMenu')
  //       .props()
  //       .onClick({ key: 'simulation&id&boundaryConditions', keyPath: [] })
  //   )
  //   // wrapper.update()
  //   expect(mockSimulationUpdate).toHaveBeenCalledTimes(4)

  //   // Force geometry (no)
  //   wrapper.unmount()
  //   mockSimulations.mockImplementation(() => [
  //     {
  //       id: 'id',
  //       scheme: {
  //         configuration: {
  //           part: {},
  //           geometry: {
  //             title: 'Geometry',
  //             file: {}
  //           }
  //         }
  //       }
  //     }
  //   ])
  //   wrapper = mount(<Project />)

  //   act(() =>
  //     wrapper
  //       .find('InternalMenu')
  //       .props()
  //       .onClick({ key: 'simulation&id&geometry', keyPath: [] })
  //   )
  //   // wrapper.update()
  //   expect(mockSimulationUpdate).toHaveBeenCalledTimes(4)

  //   // Force geometry (error)
  //   wrapper.unmount()
  //   mockSimulations.mockImplementation(() => [
  //     {
  //       id: 'id',
  //       scheme: {
  //         configuration: {
  //           geometry: {
  //             title: 'Geometry',
  //             file: {}
  //           }
  //         }
  //       }
  //     }
  //   ])
  //   mockSimulationUpdate.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   wrapper = mount(<Project />)

  //   act(() =>
  //     wrapper
  //       .find('InternalMenu')
  //       .props()
  //       .onClick({ key: 'simulation&id&materials', keyPath: [] })
  //   )
  //   wrapper.update()
  //   expect(mockSimulationUpdate).toHaveBeenCalledTimes(5)

  //   // Remove part
  //   wrapper.unmount()
  //   mockSimulationUpdate.mockReset()
  //   mockSimulations.mockImplementation(() => [
  //     {
  //       id: 'id',
  //       scheme: {
  //         configuration: {
  //           part: { type: 'geometry' },
  //           geometry: {
  //             title: 'Geometry'
  //           }
  //         }
  //       }
  //     }
  //   ])
  //   wrapper = mount(<Project />)

  //   act(() =>
  //     wrapper
  //       .find('InternalMenu')
  //       .props()
  //       .onClick({ key: 'simulation&id&materials', keyPath: [] })
  //   )
  //   wrapper.update()
  //   expect(mockSimulationUpdate).toHaveBeenCalledTimes(1)

  //   // Remove part (error)
  //   wrapper.unmount()
  //   mockSimulationUpdate.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   wrapper = mount(<Project />)

  //   act(() =>
  //     wrapper
  //       .find('InternalMenu')
  //       .props()
  //       .onClick({ key: 'simulation&id&materials', keyPath: [] })
  //   )
  //   wrapper.update()
  //   expect(mockSimulationUpdate).toHaveBeenCalledTimes(2)
  // })
})
