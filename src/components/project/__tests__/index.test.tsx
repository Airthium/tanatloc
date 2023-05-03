import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { IFrontGeometries, IFrontSimulations } from '@/api/index.d'

import Project, { errors } from '@/components/project'

jest.mock('next/dynamic', () => (callback: () => Promise<void>) => {
  callback().catch((_err) => {})

  return () => <div />
})

const mockPush = jest.fn()
const mockReplace = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
    push: async () => mockPush(),
    replace: () => mockReplace()
  })
}))

const mockGoBack = jest.fn()
jest.mock('@/components/assets/button', () => ({
  GoBack: (props: any) => mockGoBack(props)
}))

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

jest.mock('@/components/loading', () => ({
  Simple: () => <div />
}))

jest.mock('@/components/notauthorized', () => () => <div />)

const mockPanel = jest.fn()
jest.mock('../panel', () => (props: any) => mockPanel(props))

const mockGeometry = jest.fn()
jest.mock('../geometry', () => {
  const Geometry = (props: any) => mockGeometry(props)
  const Add = (props: any) => (
    <div role="GeometryAdd" onClick={props.setVisible} />
  )
  Geometry.Add = Add
  Geometry.componentName = 'Geometry'
  return Geometry
})

jest.mock('../view', () => () => <div />)

const mockSelector = jest.fn()
jest.mock('../simulation', () => {
  let count = 0
  return {
    Selector: (props: any) => mockSelector(props),
    Updater: () => <div />,
    About: () => <div />,
    Geometry: () => <div />,
    Materials: (props: any) => (
      <div role="Simulation.Materials" onClick={() => props.setVisible()} />
    ),
    Parameters: () => <div />,
    Initialization: () => <div />,
    BoundaryConditions: (props: any) => (
      <div
        role="Simulation.BoundaryCondition"
        onClick={() => props.setVisible()}
      />
    ),
    Run: (props: any) => (
      <div
        role="Simulation.Run"
        onClick={() => {
          count++
          if (count === 1) props.setResults([{}])
          else if (count === 2) props.setResults([])
          else props.setVisible(false)
        }}
      />
    ),
    Postprocessing: (props: any) => (
      <div
        role="Simulation.Postprocessing"
        onClick={() => props.setResult({})}
      />
    )
  }
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
const mockErrorProject = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@/api/project', () => ({
  useProject: () => [
    mockProject(),
    {
      reloadProject: jest.fn,
      mutateProject: jest.fn,
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
      addOneSimulation: jest.fn,
      delOneSimulation: jest.fn,
      mutateOneSimulation: jest.fn,
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
      addOneGeometry: jest.fn,
      delOneGeometry: jest.fn,
      mutateOneGeometry: jest.fn,
      errorGeometries: mockErrorGeometries(),
      loadingGeometries: mockLoadingGeometries()
    }
  ]
}))

describe('components/project', () => {
  const project = {
    title: 'title',
    simulations: ['ids1', 'ids2']
  }

  const simulation1 = {
    id: 'ids1',
    name: 'Simulation 1',
    scheme: {
      user: 'id',
      configuration: {
        dimension: 2,
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
  }
  const simulation2 = {
    id: 'ids2',
    name: 'Simulation 2',
    scheme: {}
  }
  const simulation3 = {
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
  const simulation4 = {
    id: 'ids4',
    name: 'Simulation 4',
    scheme: {
      configuration: {
        geometry: {
          index: 0,
          title: 'Simulation 4 Geometry',
          values: ['idg']
        }
      }
    }
  }

  const geometry = { id: 'idg', name: 'Geometry', summary: {} }

  beforeEach(() => {
    mockPush.mockReset()
    mockReplace.mockReset()

    mockGoBack.mockReset()
    mockGoBack.mockImplementation(() => <div />)

    mockErrorNotification.mockReset()

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
    mockUserLoading.mockImplementation(() => false)

    mockProject.mockReset()

    mockProject.mockImplementation(() => project)
    mockErrorProject.mockReset()
    mockUpdate.mockReset()

    mockSimulations.mockReset()
    const simulations = [simulation1, simulation2, simulation3, simulation4]
    mockSimulations.mockImplementation(() => simulations)
    mockErrorSimulations.mockReset()
    mockSimulationAdd.mockReset()
    mockSimulationUpdate.mockReset()
    mockLoadingSimulations.mockReset()
    mockLoadingSimulations.mockImplementation(() => false)

    mockGeometries.mockReset()
    const geometries = [geometry]
    mockGeometries.mockImplementation(() => geometries)
    mockErrorGeometries.mockReset()
    mockLoadingGeometries.mockReset()
    mockLoadingGeometries.mockImplementation(() => false)
  })

  test('render', () => {
    const { unmount } = render(<Project />)

    unmount()
  })

  test('no user', () => {
    mockUser.mockImplementation(() => {
      // Empty
    })
    const { unmount } = render(<Project />)

    expect(mockReplace).toHaveBeenCalledTimes(2)

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
    mockProject.mockImplementation(() => ({
      id: '0'
    }))
    const { unmount } = render(<Project />)

    unmount()
  })

  test('errors', () => {
    mockErrorUser.mockImplementation(() => true)
    mockErrorProject.mockImplementation(() => true)
    mockErrorSimulations.mockImplementation(() => true)
    mockErrorGeometries.mockImplementation(() => true)
    const { unmount } = render(<Project />)

    expect(mockErrorNotification).toHaveBeenCalledTimes(4)

    unmount()
  })

  test('auto open geometry', () => {
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

  test('Update geometry', () => {
    const { rerender, unmount } = render(<Project />)

    // Rename
    const newGeometry1 = { id: geometry.id, name: 'Geometry rename' }
    const newGeometries1 = [newGeometry1]
    mockGeometries.mockImplementation(() => newGeometries1)

    rerender(<Project />)

    screen.getByRole('menuitem', { name: 'pie-chart Geometry rename eye' })

    // Remove
    const newGeometries2: IFrontGeometries = []
    mockGeometries.mockImplementation(() => newGeometries2)

    rerender(<Project />)

    unmount()
  })

  test('Simulation with geometry value & values', () => {
    {
      const simulationWithGeoId = {
        ...simulation1,
        scheme: {
          ...simulation1.scheme,
          configuration: {
            ...simulation1.scheme.configuration,
            geometry: {
              ...simulation1.scheme.configuration.geometry,
              value: geometry.id
            }
          }
        }
      }
      const simulations = [simulationWithGeoId]
      mockSimulations.mockImplementation(() => simulations)
    }

    const { rerender, unmount } = render(<Project />)

    {
      const simulationWithGeoIds = {
        ...simulation1,
        scheme: {
          ...simulation1.scheme,
          configuration: {
            ...simulation1.scheme.configuration,
            geometry: {
              ...simulation1.scheme.configuration.geometry,
              multiple: true,
              n: 1,
              values: [geometry.id]
            }
          }
        }
      }
      const simulations = [simulationWithGeoIds]
      mockSimulations.mockImplementation(() => simulations)
    }

    rerender(<Project />)

    {
      const simulationWithGeoIdsWithoutN = {
        ...simulation1,
        scheme: {
          ...simulation1.scheme,
          configuration: {
            ...simulation1.scheme.configuration,
            geometry: {
              ...simulation1.scheme.configuration.geometry,
              multiple: true,
              values: [geometry.id]
            }
          }
        }
      }
      const simulations = [simulationWithGeoIdsWithoutN]
      mockSimulations.mockImplementation(() => simulations)
    }

    rerender(<Project />)

    unmount()
  })

  test('Update simulation', () => {
    const { rerender, unmount } = render(<Project />)

    const simulation1Item = screen.getByRole('menuitem', {
      name: 'code-sandbox audit Simulation 1'
    })
    fireEvent.click(simulation1Item)

    const simulation1ItemAbout = screen.getByRole('menuitem', {
      name: 'check-circle About'
    })
    fireEvent.click(simulation1ItemAbout)

    // Rename
    const newSimulation1 = {
      ...simulation1,
      name: 'Simulation 1 rename'
    }
    const newSimulations1 = [newSimulation1]
    mockSimulations.mockImplementation(() => newSimulations1)

    rerender(<Project />)

    screen.getByRole('menuitem', {
      name: 'code-sandbox audit Simulation 1 rename'
    })

    // Rename
    const geometryItem = screen.getByRole('menuitem', {
      name: 'pie-chart Geometry eye'
    })
    fireEvent.click(geometryItem)

    const newSimulation2 = {
      ...simulation1,
      name: 'Simulation 1'
    }
    const newSimulations2 = [newSimulation2]
    mockSimulations.mockImplementation(() => newSimulations2)

    rerender(<Project />)

    // Remove
    const newSimulations3: IFrontSimulations = []
    mockSimulations.mockImplementation(() => newSimulations3)

    rerender(<Project />)

    unmount()
  })

  test('menu', () => {
    mockSelector.mockImplementation((props) => (
      <div role="Selector" onClick={props.onCancel} />
    ))
    mockPanel.mockImplementation((props) => <div>{props.children}</div>)
    const { unmount } = render(<Project />)

    // Click geometry
    const geometry = screen.getByRole('menuitem', {
      name: 'pie-chart Geometry eye'
    })
    fireEvent.click(geometry)

    // Click new geometry
    const newGeometry = screen.getByRole('button', {
      name: 'upload New Geometry'
    })
    fireEvent.click(newGeometry)

    // Click new simulation
    const newSimulation = screen.getByRole('button', {
      name: 'plus-circle New Simulation'
    })
    fireEvent.click(newSimulation)

    // Close selector
    const selector = screen.getByRole('Selector')
    fireEvent.click(selector)

    // Open simulation 2
    const simulation2 = screen.getByRole('menuitem', {
      name: 'code-sandbox Simulation 2'
    })
    fireEvent.click(simulation2)

    // Open simulation 1
    const simulation1 = screen.getByRole('menuitem', {
      name: 'code-sandbox audit Simulation 1'
    })
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
    const materials = screen.getByRole('Simulation.Materials')
    fireEvent.click(materials)

    simulationItem = screen.getByRole('menuitem', {
      name: 'exclamation-circle Simulation 1 Initialization'
    })
    fireEvent.click(simulationItem)

    simulationItem = screen.getByRole('menuitem', {
      name: 'exclamation-circle Simulation 1 BC'
    })
    fireEvent.click(simulationItem)
    const boundaryCondition = screen.getByRole('Simulation.BoundaryCondition')
    fireEvent.click(boundaryCondition)

    simulationItem = screen.getByRole('menuitem', {
      name: 'close-circle Simulation 1 Run'
    })
    fireEvent.click(simulationItem)

    simulationItem = screen.getByRole('menuitem', {
      name: 'exclamation-circle Simulation 1 Unknown'
    })
    fireEvent.click(simulationItem)

    // Open simulation 3
    const simulation3 = screen.getByRole('menuitem', {
      name: 'code-sandbox Simulation 3'
    })
    fireEvent.click(simulation3)

    simulationItem = screen.getByRole('menuitem', {
      name: 'exclamation-circle Simulation 3 Geometry'
    })
    fireEvent.click(simulationItem)

    // Open simulation 4
    const simulation4 = screen.getByRole('menuitem', {
      name: 'code-sandbox Simulation 4'
    })
    fireEvent.click(simulation4)

    simulationItem = screen.getByRole('menuitem', {
      name: 'exclamation-circle Simulation 4 Geometry'
    })
    fireEvent.click(simulationItem)

    unmount()
  })

  test('Geometry add visible', () => {
    const { unmount } = render(<Project />)

    const geometryAdd = screen.getByRole('GeometryAdd')
    fireEvent.click(geometryAdd)

    unmount()
  })

  test('Geometry cleanup', () => {
    mockPanel.mockImplementation((props) => <div>{props.children}</div>)
    mockGeometry.mockImplementation((props) => (
      <div role="Geometry" onClick={() => props.onCleanup('idg')} />
    ))
    const { unmount } = render(<Project />)

    const geometry = screen.getByRole('menuitem', {
      name: 'pie-chart Geometry eye'
    })
    fireEvent.click(geometry)

    const geometryPanel = screen.getByRole('Geometry')
    fireEvent.click(geometryPanel)

    unmount()
  })

  test('Open non visible geometry', () => {
    const geometry2 = { id: 'idg2', name: 'Geometry 2', summary: {} }
    const newGeometries = [geometry, geometry2]
    mockGeometries.mockImplementation(() => newGeometries)

    const { unmount } = render(<Project />)

    const geo2 = screen.getByRole('menuitem', {
      name: 'pie-chart Geometry 2 eye-invisible'
    })
    fireEvent.click(geo2)

    screen.getByRole('menuitem', {
      name: 'pie-chart Geometry 2 eye'
    })

    unmount()
  })

  test('eye', () => {
    const geometry2 = { id: 'idg2', name: 'Geometry 2', summary: {} }
    const newGeometries = [geometry, geometry2]
    mockGeometries.mockImplementation(() => newGeometries)

    const { unmount } = render(<Project />)

    const add = screen.getByRole('img', { name: 'eye-invisible' })
    fireEvent.click(add)

    const del = screen.getAllByRole('img', { name: 'eye' })
    fireEvent.click(del[0])

    const reAdd = screen.getByRole('img', { name: 'eye-invisible' })
    fireEvent.click(reAdd)

    const open = screen.getByRole('menuitem', {
      name: 'pie-chart Geometry eye'
    })
    fireEvent.click(open)

    const reDel = screen.getAllByRole('img', { name: 'eye' })
    fireEvent.click(reDel[0])

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
    await act(() => fireEvent.click(selector))
    await waitFor(() => expect(mockSimulationAdd).toHaveBeenCalledTimes(1))

    // Error
    mockSimulationAdd.mockImplementation(() => {
      throw new Error('add error')
    })
    await act(() => fireEvent.click(selector))
    await waitFor(() => expect(mockSimulationAdd).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.add,
        new Error('add error')
      )
    )

    unmount()
  })

  test('result', () => {
    mockPanel.mockImplementation((props) => <div>{props.children}</div>)
    const { unmount } = render(<Project />)

    const simulation1 = screen.getByRole('menuitem', {
      name: 'code-sandbox audit Simulation 1'
    })
    fireEvent.click(simulation1)

    const simulationItem = screen.getByRole('menuitem', {
      name: 'close-circle Simulation 1 Run'
    })
    fireEvent.click(simulationItem)

    const run = screen.getByRole('Simulation.Run')
    fireEvent.click(run)

    const postprocessing = screen.getByRole('Simulation.Postprocessing')
    fireEvent.click(postprocessing)

    fireEvent.click(run)

    fireEvent.click(run)

    unmount()
  })
})
