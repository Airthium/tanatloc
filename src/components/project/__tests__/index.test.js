import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Project from '@/components/project'

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

jest.mock('@/components/notauthorized', () => () => <div />)

jest.mock('../panel', () => () => <div />)

jest.mock('../geometry', () => {
  const Geometry = () => <div />
  const Add = () => <div />
  Geometry.Add = Add
  return Geometry
})

jest.mock('../view', () => () => <div />)

jest.mock('../data', () => () => <div />)

jest.mock('../simulation', () => {
  const Simulation = {}
  const Selector = () => <div />
  const Updater = () => <div />
  Simulation.Selector = Selector
  Simulation.Updater = Updater
  return Simulation
})

const mockUser = jest.fn()
const mockErrorUser = jest.fn()
const mockUserLoading = jest.fn()
jest.mock('@/api/user', () => ({
  useUser: () => [
    mockUser(),
    {
      errorUser: mockErrorUser(),
      loadingUser: mockUserLoading()
    }
  ]
}))

const mockProject = jest.fn()
const mockReloadProject = jest.fn()
const mockMutateProject = jest.fn()
const mockErrorProject = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@/api/project', () => ({
  useProject: () => [
    mockProject(),
    {
      reloadProject: mockReloadProject,
      mutateProject: mockMutateProject,
      errorProject: mockErrorProject(),
      loadingProject: false
    }
  ],
  update: async () => mockUpdate()
}))

const mockSimulations = jest.fn()
const mockErrorSimulations = jest.fn()
const mockSimulationUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  add: async () => ({ id: 'id' }),
  update: async () => mockSimulationUpdate(),
  useSimulations: () => [
    mockSimulations(),
    {
      addOneSimulation: jest.fn(),
      delOneSimulation: jest.fn(),
      mutateOneSimulation: jest.fn(),
      errorSimulations: mockErrorSimulations(),
      loadingSimulations: false
    }
  ]
}))

const mockGeometries = jest.fn()
const mockErrorGeometries = jest.fn()
jest.mock('@/api/geometry', () => ({
  useGeometries: () => [
    mockGeometries(),
    {
      addOneGeometry: jest.fn(),
      delOneGeometry: jest.fn(),
      mutateOneGeometry: jest.fn(),
      errorGeometries: mockErrorGeometries(),
      loadingGeometries: false
    }
  ]
}))

describe('components/project', () => {
  beforeEach(() => {
    mockRouter.mockReset()

    mockError.mockReset()

    mockUser.mockReset()
    mockUser.mockImplementation(() => ({ id: 'id' }))
    mockErrorUser.mockReset()
    mockUserLoading.mockReset()

    mockProject.mockReset()
    mockProject.mockImplementation(() => ({
      title: 'title',
      simulations: ['id', 'id']
    }))
    mockReloadProject.mockReset()
    mockMutateProject.mockReset()
    mockErrorProject.mockReset()
    mockUpdate.mockReset()

    mockSimulations.mockReset()
    mockSimulations.mockImplementation(() => [
      {
        id: 'id',
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
    mockErrorSimulations.mockReset()
    mockSimulationUpdate.mockReset()

    mockGeometries.mockReset()
    mockGeometries.mockImplementation(() => [])
    mockErrorGeometries.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Project />)

    unmount()
  })

  test('no user', () => {
    mockUser.mockImplementation(() => {})
    const { unmount } = render(<Project />)

    expect(mockRouter).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('loading', () => {
    mockUserLoading.mockImplementation(() => true)
    const { unmount } = render(<Project />)

    unmount()
  })

  test('errors', () => {
    mockErrorUser.mockImplementation(() => true)
    mockErrorProject.mockImplementation(() => true)
    mockErrorSimulations.mockImplementation(() => true)
    mockErrorGeometries.mockImplementation(() => true)
    const { unmount } = render(<Project />)

    expect(mockError).toHaveBeenCalledTimes(4)

    unmount()
  })

  // test('without configuration', () => {
  //   wrapper.unmount()
  //   mockSimulations.mockImplementation(() => [{ scheme: {} }])
  //   wrapper = shallow(<Project />)
  //   expect(wrapper).toBeDefined()
  // })

  // test('with subMenus', () => {
  //   wrapper.unmount()
  //   mockSimulations.mockImplementation(() => [
  //     {
  //       scheme: {
  //         configuration: {
  //           geometry: {
  //             title: 'Geometry',
  //             subMenus: [
  //               {
  //                 title: 'title1'
  //               },
  //               { title: 'title2' }
  //             ]
  //           },
  //           something: {
  //             done: true,
  //             subMenus: [
  //               {
  //                 title: 'title1'
  //               },
  //               { title: 'title2' }
  //             ]
  //           }
  //         }
  //       }
  //     }
  //   ])
  //   wrapper = shallow(<Project />)
  // })

  // test('Unauthorized', () => {
  //   wrapper.unmount()
  //   mockProject.mockImplementation(() => 'Unauthorized')
  //   wrapper = shallow(<Project />)
  // })

  // test('handleTitle', async () => {
  //   await wrapper.find('Title').props().editable.onChange('title')
  //   expect(mockUpdate).toHaveBeenCalledTimes(1)
  //   expect(mockMutateProject).toHaveBeenCalledTimes(1)

  //   wrapper.unmount()
  //   mockMutateProject.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   wrapper = shallow(<Project />)
  //   await wrapper.find('Title').props().editable.onChange('title')
  // })

  // test('handleDashboard', () => {
  //   wrapper.find('GoBack').props().onClick()
  //   expect(mockRouter).toHaveBeenCalledTimes(1)
  // })

  // test('addSimulation', () => {
  //   wrapper.find('Button').props().onClick()
  //   expect(wrapper.find('Selector').props().visible).toBe(true)
  // })

  // test('selectorOk', async () => {
  //   await wrapper.find('Selector').props().onOk({ configuration: {} })

  //   expect(wrapper.find('Menu').props().children.length).toBe(6)

  //   //Empty
  //   wrapper.unmount()
  //   mockProject.mockImplementation(() => ({}))
  //   wrapper = shallow(<Project />)
  //   await wrapper.find('Selector').props().onOk({ configuration: {} })

  //   // Error
  //   wrapper.unmount()
  //   mockMutateProject.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   wrapper = shallow(<Project />)
  //   await wrapper.find('Selector').props().onOk({ configuration: {} })
  // })

  // test('selector cancel', () => {
  //   wrapper.find('Selector').props().onCancel()
  //   expect(wrapper.find('Selector').props().visible).toBe(false)
  // })

  // test('select simulation', async () => {
  //   // Add simulation first
  //   await wrapper
  //     .find('Selector')
  //     .props()
  //     .onOk({
  //       children: [
  //         {
  //           type: 'geometry'
  //         }
  //       ]
  //     })

  //   wrapper
  //     .find('Menu')
  //     .props()
  //     .onClick({ key: 'simulation&0&geometry', keyPath: [] })
  // })

  // test('unknow key', () => {
  //   wrapper.find('Menu').props().onClick({ key: 'unknow', keyPath: [] })
  // })

  // test('simulation close', () => {
  //   wrapper.find('Simulation').props().onClose()
  //   expect(wrapper.find('Simulation').props().simulation).toBe(undefined)
  // })

  // // test('user effect', () => {
  // //   wrapper.unmount()

  // //   // With user
  // //   wrapper = mount(<Project />)
  // //   expect(mockRouter).toHaveBeenCalledTimes(0)
  // //   wrapper.unmount()

  // //   // Without user
  // //   mockUser.mockImplementation(() => {})
  // //   wrapper = mount(<Project />)
  // //   expect(mockRouter).toHaveBeenCalledTimes(1)
  // // })

  // // test('simulation effect', () => {
  // //   // Update
  // //   wrapper.unmount()
  // //   const mockTitle = jest.fn(() => 'title')
  // //   mockSimulations.mockImplementation(() => [
  // //     {
  // //       id: 'id',
  // //       scheme: {
  // //         configuration: {
  // //           geometry: {
  // //             title: mockTitle(),
  // //             file: {}
  // //           }
  // //         }
  // //       }
  // //     }
  // //   ])
  // //   wrapper = mount(<Project />)
  // //   mockTitle.mockImplementation(() => 'newTitle')

  // //   act(() =>
  // //     wrapper
  // //       .find('InternalMenu')
  // //       .props()
  // //       .onClick({ key: 'simulation&id&materials', keyPath: [] })
  // //   )
  // //   expect(mockSimulationUpdate).toHaveBeenCalledTimes(2)

  // //   // Force geometry
  // //   wrapper.unmount()
  // //   mockSimulations.mockImplementation(() => [
  // //     {
  // //       id: 'id',
  // //       scheme: {
  // //         configuration: {
  // //           geometry: {
  // //             title: 'Geometry',
  // //             file: {}
  // //           }
  // //         }
  // //       }
  // //     }
  // //   ])
  // //   wrapper = mount(<Project />)

  // //   act(() =>
  // //     wrapper
  // //       .find('InternalMenu')
  // //       .props()
  // //       .onClick({ key: 'simulation&id&materials', keyPath: [] })
  // //   )
  // //   // wrapper.update()
  // //   expect(mockSimulationUpdate).toHaveBeenCalledTimes(3)

  // //   // Force geometry (with part)
  // //   wrapper.unmount()
  // //   mockSimulations.mockImplementation(() => [
  // //     {
  // //       id: 'id',
  // //       scheme: {
  // //         configuration: {
  // //           part: {},
  // //           geometry: {
  // //             title: 'Geometry',
  // //             file: {}
  // //           }
  // //         }
  // //       }
  // //     }
  // //   ])
  // //   wrapper = mount(<Project />)

  // //   act(() =>
  // //     wrapper
  // //       .find('InternalMenu')
  // //       .props()
  // //       .onClick({ key: 'simulation&id&boundaryConditions', keyPath: [] })
  // //   )
  // //   // wrapper.update()
  // //   expect(mockSimulationUpdate).toHaveBeenCalledTimes(4)

  // //   // Force geometry (no)
  // //   wrapper.unmount()
  // //   mockSimulations.mockImplementation(() => [
  // //     {
  // //       id: 'id',
  // //       scheme: {
  // //         configuration: {
  // //           part: {},
  // //           geometry: {
  // //             title: 'Geometry',
  // //             file: {}
  // //           }
  // //         }
  // //       }
  // //     }
  // //   ])
  // //   wrapper = mount(<Project />)

  // //   act(() =>
  // //     wrapper
  // //       .find('InternalMenu')
  // //       .props()
  // //       .onClick({ key: 'simulation&id&geometry', keyPath: [] })
  // //   )
  // //   // wrapper.update()
  // //   expect(mockSimulationUpdate).toHaveBeenCalledTimes(4)

  // //   // Force geometry (error)
  // //   wrapper.unmount()
  // //   mockSimulations.mockImplementation(() => [
  // //     {
  // //       id: 'id',
  // //       scheme: {
  // //         configuration: {
  // //           geometry: {
  // //             title: 'Geometry',
  // //             file: {}
  // //           }
  // //         }
  // //       }
  // //     }
  // //   ])
  // //   mockSimulationUpdate.mockImplementation(() => {
  // //     throw new Error()
  // //   })
  // //   wrapper = mount(<Project />)

  // //   act(() =>
  // //     wrapper
  // //       .find('InternalMenu')
  // //       .props()
  // //       .onClick({ key: 'simulation&id&materials', keyPath: [] })
  // //   )
  // //   wrapper.update()
  // //   expect(mockSimulationUpdate).toHaveBeenCalledTimes(5)

  // //   // Remove part
  // //   wrapper.unmount()
  // //   mockSimulationUpdate.mockReset()
  // //   mockSimulations.mockImplementation(() => [
  // //     {
  // //       id: 'id',
  // //       scheme: {
  // //         configuration: {
  // //           part: { type: 'geometry' },
  // //           geometry: {
  // //             title: 'Geometry'
  // //           }
  // //         }
  // //       }
  // //     }
  // //   ])
  // //   wrapper = mount(<Project />)

  // //   act(() =>
  // //     wrapper
  // //       .find('InternalMenu')
  // //       .props()
  // //       .onClick({ key: 'simulation&id&materials', keyPath: [] })
  // //   )
  // //   wrapper.update()
  // //   expect(mockSimulationUpdate).toHaveBeenCalledTimes(1)

  // //   // Remove part (error)
  // //   wrapper.unmount()
  // //   mockSimulationUpdate.mockImplementation(() => {
  // //     throw new Error()
  // //   })
  // //   wrapper = mount(<Project />)

  // //   act(() =>
  // //     wrapper
  // //       .find('InternalMenu')
  // //       .props()
  // //       .onClick({ key: 'simulation&id&materials', keyPath: [] })
  // //   )
  // //   wrapper.update()
  // //   expect(mockSimulationUpdate).toHaveBeenCalledTimes(2)
  // // })
})
