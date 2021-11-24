import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Project from '@/components/project'

const mockPush = jest.fn()
const mockReplace = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
    push: () => mockPush(),
    replace: () => mockReplace()
  })
}))

jest.mock('/public/icons/geometries', () => () => <div />, { virtual: true })

const mockGoBack = jest.fn()
jest.mock('@/components/assets/button', () => ({
  GoBack: (props) => mockGoBack(props)
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('@/components/loading', () => ({
  Simple: () => <div />
}))

jest.mock('@/components/notauthorized', () => () => <div />)

const mockPanel = jest.fn()
jest.mock('../panel', () => (props) => mockPanel(props))

const mockGeometry = jest.fn()
jest.mock('../geometry', () => {
  const Geometry = (props) => mockGeometry(props)
  const Add = () => <div />
  Geometry.Add = Add
  return Geometry
})

jest.mock('../view', () => () => <div />)

jest.mock('../data', () => () => <div />)

const mockSelector = jest.fn()
jest.mock('../simulation', () => {
  const Simulation = {
    Selector: (props: {}) => mockSelector(props),
    Updater: () => <div />,
    About: () => <div />,
    Geometry: () => <div />,
    Materials: () => <div />,
    Parameters: () => <div />,
    Initialization: () => <div />,
    BoundaryConditions: () => <div />,
    Run: () => <div />
  }
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
const mockSimulationAdd = jest.fn()
const mockSimulationUpdate = jest.fn()
const mockLoadingSimulations = jest.fn()
jest.mock('@/api/simulation', () => ({
  add: async () => mockSimulationAdd(),
  update: async () => mockSimulationUpdate(),
  useSimulations: () => [
    mockSimulations(),
    {
      addOneSimulation: jest.fn(),
      delOneSimulation: jest.fn(),
      mutateOneSimulation: jest.fn(),
      errorSimulations: mockErrorSimulations(),
      loadingSimulations: mockLoadingSimulations()
    }
  ]
}))

const mockGeometries = jest.fn()
const mockErrorGeometries = jest.fn()
const mockLoadingGeometries = jest.fn()
jest.mock('@/api/geometry', () => ({
  useGeometries: () => [
    mockGeometries(),
    {
      addOneGeometry: jest.fn(),
      delOneGeometry: jest.fn(),
      mutateOneGeometry: jest.fn(),
      errorGeometries: mockErrorGeometries(),
      loadingGeometries: mockLoadingGeometries()
    }
  ]
}))

describe('components/project', () => {
  beforeEach(() => {
    mockPush.mockReset()
    mockReplace.mockReset()

    mockGoBack.mockReset()
    mockGoBack.mockImplementation(() => <div />)

    mockError.mockReset()

    mockPanel.mockReset()
    mockPanel.mockImplementation(() => <div />)

    mockGeometry.mockReset()
    mockGeometry.mockImplementation(() => <div />)

    mockSelector.mockReset()
    mockSelector.mockImplementation(() => <div />)

    mockUser.mockReset()
    mockUser.mockImplementation(() => ({ id: 'id' }))
    mockErrorUser.mockReset()
    mockUserLoading.mockReset()

    mockProject.mockReset()
    mockProject.mockImplementation(() => ({
      title: 'title',
      simulations: ['ids1', 'ids2']
    }))
    mockReloadProject.mockReset()
    mockMutateProject.mockReset()
    mockErrorProject.mockReset()
    mockUpdate.mockReset()

    mockSimulations.mockReset()
    mockSimulations.mockImplementation(() => [
      {
        id: 'ids1',
        name: 'Simulation 1',
        scheme: {
          configuration: {
            geometry: {
              index: 0,
              title: 'Simulation 1 Geometry'
            },
            parameters: {
              index: 1,
              title: 'Simulation 1 Parameters',
              done: true
            },
            materials: {
              index: 2,
              title: 'Simulation 1 Materials'
            },
            boundaryConditions: {
              index: 3,
              title: 'Simulation 1 BC'
            },
            initialization: {
              index: 4,
              title: 'Simulation 1 Initialization'
            },
            run: {
              index: 5,
              title: 'Simulation 1 Run',
              error: true
            },
            unknown: {
              index: 6,
              title: 'Simulation 1 Unknown'
            }
          }
        }
      },
      {
        id: 'ids2',
        name: 'Simulation 2',
        scheme: {}
      },
      {
        id: 'ids3',
        name: 'Simulation 3',
        scheme: {
          configuration: {
            geometry: {
              index: 0,
              title: 'Simulation 3 Geometry',
              value: 'idg'
            }
          }
        }
      }
    ])
    mockErrorSimulations.mockReset()
    mockSimulationAdd.mockReset()
    mockSimulationUpdate.mockReset()
    mockLoadingSimulations.mockReset()

    mockGeometries.mockReset()
    mockGeometries.mockImplementation(() => [{ id: 'idg', name: 'Geometry' }])
    mockErrorGeometries.mockReset()
    mockLoadingGeometries.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Project />)

    unmount()
  })

  test('no user', () => {
    mockUser.mockImplementation(() => {
      //
    })
    const { unmount } = render(<Project />)

    expect(mockReplace).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('loading', () => {
    mockUserLoading.mockImplementation(() => true)
    const { unmount } = render(<Project />)

    unmount()
  })

  test('loading geometries & simulation', () => {
    mockLoadingGeometries.mockImplementation(() => true)
    mockLoadingSimulations.mockImplementation(() => true)
    const { unmount } = render(<Project />)

    unmount()
  })

  test('Unauthorized', () => {
    mockProject.mockImplementation(() => 'Unauthorized')
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

  test('autoopen geometry', () => {
    mockGeometries.mockImplementation(() => [])
    const { unmount } = render(<Project />)

    unmount()
  })

  test('dashboard', () => {
    mockGoBack.mockImplementation((props) => (
      <div role="GoBack" onClick={props.onClick} />
    ))
    const { unmount } = render(<Project />)

    const goBack = screen.getByRole('GoBack')
    fireEvent.click(goBack)

    expect(mockPush).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('menu', async () => {
    mockSelector.mockImplementation((props) => (
      <div role="Selector" onClick={props.onCancel} />
    ))
    const { unmount } = render(<Project />)

    // Open submenus
    const geometries = screen.getByRole('menuitem', { name: 'Geometries (1)' })
    fireEvent.click(geometries)

    const simulations = screen.getByRole('menuitem', {
      name: 'calculator Simulations (3)'
    })
    fireEvent.click(simulations)

    // Click geometry
    const geometry = screen.getByRole('menuitem', { name: 'Geometry' })
    fireEvent.click(geometry)

    // Click new geometry
    const newGeometry = screen.getByRole('button', {
      name: 'plus New Geometry'
    })
    fireEvent.click(newGeometry)

    // Click new simulation
    const newSimulation = screen.getByRole('button', {
      name: 'plus New Simulation'
    })
    fireEvent.click(newSimulation)

    // Close selector
    const selector = screen.getByRole('Selector')
    fireEvent.click(selector)

    // Open simulation 2
    const simulation2 = screen.getByRole('menuitem', { name: 'Simulation 2' })
    fireEvent.click(simulation2)

    // Open simulation 1
    const simulation1 = screen.getByRole('menuitem', { name: 'Simulation 1' })
    fireEvent.click(simulation1)

    // Click simulation items
    let simulationItems = screen.getAllByRole('menuitem', {
      name: 'check-circle About'
    })
    fireEvent.click(simulationItems[1])

    let simulationItem = screen.getByRole('menuitem', {
      name: 'exclamation-circle Simulation 1 Geometry'
    })
    fireEvent.click(simulationItem)

    simulationItem = screen.getByRole('menuitem', {
      name: 'check-circle Simulation 1 Parameters'
    })
    fireEvent.click(simulationItem)

    simulationItem = screen.getByRole('menuitem', {
      name: 'exclamation-circle Simulation 1 Materials'
    })
    fireEvent.click(simulationItem)

    simulationItem = screen.getByRole('menuitem', {
      name: 'exclamation-circle Simulation 1 Initialization'
    })
    fireEvent.click(simulationItem)

    simulationItem = screen.getByRole('menuitem', {
      name: 'exclamation-circle Simulation 1 BC'
    })
    fireEvent.click(simulationItem)

    simulationItem = screen.getByRole('menuitem', {
      name: 'exclamation-circle Simulation 1 Run'
    })
    fireEvent.click(simulationItem)

    simulationItem = screen.getByRole('menuitem', {
      name: 'exclamation-circle Simulation 1 Unknown'
    })
    fireEvent.click(simulationItem)

    // Open simulation 3
    const simulation3 = screen.getByRole('menuitem', { name: 'Simulation 3' })
    fireEvent.click(simulation3)

    simulationItem = screen.getByRole('menuitem', {
      name: 'exclamation-circle Simulation 3 Geometry'
    })
    fireEvent.click(simulationItem)

    unmount()
  })

  test('Selector', async () => {
    mockProject.mockImplementation(() => ({}))
    mockSelector.mockImplementation((props) => (
      <div role="Selector" onClick={() => props.onOk({})} />
    ))
    const { unmount } = render(<Project />)

    const selector = screen.getByRole('Selector')

    // Normal
    mockSimulationAdd.mockImplementation(() => ({ id: 'id' }))
    fireEvent.click(selector)
    await waitFor(() => expect(mockSimulationAdd).toHaveBeenCalledTimes(1))

    // Error
    mockSimulationAdd.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(selector)
    await waitFor(() => expect(mockSimulationAdd).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('panel', () => {
    mockPanel.mockImplementation((props) => (
      <div role="Panel" onClick={props.onClose} />
    ))
    const { unmount } = render(<Project />)

    const panel = screen.getByRole('Panel')
    fireEvent.click(panel)

    unmount()
  })

  test('Update geometry', () => {
    mockPanel.mockImplementation((props) => (
      <div role="Panel" onClick={props.onClose} />
    ))

    let geometryName = 'Geometry'
    mockGeometries.mockImplementation(() => [{ id: 'idg', name: geometryName }])

    const { unmount } = render(<Project />)

    // Select geometry
    const geometries = screen.getByRole('menuitem', { name: 'Geometries (1)' })
    fireEvent.click(geometries)
    const simulations = screen.getByRole('menuitem', {
      name: 'calculator Simulations (3)'
    })
    fireEvent.click(simulations)
    const simulation1 = screen.getByRole('menuitem', { name: 'Simulation 1' })
    fireEvent.click(simulation1)
    const simulationItem = screen.getByRole('menuitem', {
      name: 'check-circle About'
    })

    const geometry = screen.getByRole('menuitem', { name: 'Geometry' })
    fireEvent.click(geometry)

    // Rename
    geometryName = 'Geometry rename'
    fireEvent.click(geometry)

    // Close panel -> not visible
    const panel = screen.getByRole('Panel')
    fireEvent.click(panel)

    // Rename
    geometryName = 'Geometry'
    fireEvent.click(simulationItem)

    // Delete geometry
    mockGeometries.mockImplementation(() => [])
    fireEvent.click(geometry)

    unmount()
  })

  test('Update simulation', () => {
    let simulationName = 'Simulation 1'
    mockSimulations.mockImplementation(() => [
      {
        id: 'ids1',
        name: simulationName,
        scheme: {
          configuration: {}
        }
      }
    ])

    const { unmount } = render(<Project />)

    // Select simulation
    const simulations = screen.getByRole('menuitem', {
      name: 'calculator Simulations (1)'
    })
    fireEvent.click(simulations)
    const simulation1 = screen.getByRole('menuitem', { name: 'Simulation 1' })
    fireEvent.click(simulation1)
    const simulationItem = screen.getByRole('menuitem', {
      name: 'check-circle About'
    })
    fireEvent.click(simulationItem)

    // Rename
    simulationName = 'Simulation 1 rename'
    fireEvent.click(simulationItem)

    // Delete
    mockSimulations.mockImplementation(() => [])
    fireEvent.click(simulationItem)

    unmount()
  })
})
