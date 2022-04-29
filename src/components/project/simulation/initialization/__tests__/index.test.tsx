import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { IFrontSimulationsItem } from '@/api/index.d'

import Initialization, { errors } from '..'

const mockFormula = jest.fn()
jest.mock(
  '@/components/assets/formula',
  () => (props: any) => mockFormula(props)
)

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockGetFilesNumbers = jest.fn()
const mockGetMultiplcator = jest.fn()
jest.mock('@/components/project/simulation/run/results/tools', () => ({
  getFilesNumbers: () => mockGetFilesNumbers(),
  getMultiplicator: () => mockGetMultiplcator()
}))

const mockUpdate = jest.fn()
const mockTasks = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate(),
  tasks: async () => mockTasks()
}))

describe('components/project/simulation/initialization', () => {
  const simulations: Pick<IFrontSimulationsItem, 'id' | 'name' | 'scheme'>[] = [
    {
      id: 'id',
      name: 'Simulation 0',
      scheme: {
        category: 'category',
        name: 'name',
        code: 'code',
        version: 'version',
        description: 'description',
        algorithm: 'algorithm1',
        //@ts-ignore
        configuration: undefined
      }
    },
    {
      id: 'id1',
      name: 'Simulation 1',
      scheme: {
        category: 'category',
        name: 'name',
        algorithm: 'algorithm1',
        code: 'code',
        version: 'version',
        description: 'description',
        //@ts-ignore
        configuration: {
          parameters: {
            index: 1,
            title: 'Parameters',
            time: {
              label: 'Time',
              children: [
                {
                  label: 'label',
                  htmlEntity: 'label',
                  default: 0
                },
                {
                  label: 'label',
                  htmlEntity: 'label',
                  default: 1
                }
              ]
            }
          },
          run: {
            index: 5,
            title: 'Run',
            resultsFilter: {
              name: 'Time',
              prefixPattern: 'result_',
              suffixPattern: '.vtu',
              pattern: 'result_\\d+.vtu',
              multiplicator: ['parameters', 'time', 'children', '1']
            }
          }
        }
      }
    },
    {
      id: 'id2',
      name: 'Simulation 2',
      scheme: {
        category: 'category',
        name: 'name',
        code: 'code',
        version: 'version',
        description: 'description',
        algorithm: 'algorithm2',
        //@ts-ignore
        configuration: undefined
      }
    },
    {
      id: 'id3',
      name: 'Simulation 3',
      scheme: {
        category: 'category',
        name: 'name',
        code: 'code',
        version: 'version',
        description: 'description',
        algorithm: 'algorithm1',
        //@ts-ignore
        configuration: undefined
      }
    }
  ]
  const simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'> = {
    id: 'id',
    scheme: {
      category: 'category',
      name: 'name',
      algorithm: 'algorithm',
      code: 'code',
      version: 'version',
      description: 'description',
      //@ts-ignore
      configuration: {
        geometry: {
          title: 'Geometry',
          index: 0,
          meshable: false
        },
        parameters: {
          index: 1,
          title: 'Parameters',
          time: {
            label: 'Time',
            children: [
              {
                label: 'label',
                htmlEntity: 'entity',
                default: 0
              },
              {
                label: 'label',
                htmlEntity: 'entity',
                default: 0,
                value: 0.1
              }
            ]
          }
        },
        initialization: {
          index: 4,
          title: 'Initialization',
          done: true,
          direct: {
            label: 'Velocity',
            children: [
              {
                label: 'Ux',
                htmlEntity: 'formula',
                default: 0,
                value: 0,
                unit: '\\(m.s^{-1}\\)'
              },
              {
                label: 'Uy',
                htmlEntity: 'formula',
                default: 0,
                unit: '\\(m.s^{-1}\\)'
              },
              {
                only3D: true,
                label: 'Uz',
                htmlEntity: 'formula',
                default: 0,
                unit: '\\(m.s^{-1}\\)'
              }
            ]
          },
          coupling: {
            label: 'Coupling',
            compatibility: [
              {
                algorithm: 'algorithm1',
                map: [1, 1, 1],
                filter: {
                  name: 'Time step',
                  pattern: 'Result_\\d+.vtu',
                  multiplicator: ['parameters', 'time', 'children', '1']
                }
              }
            ]
          },
          //@ts-ignore
          value: {}
        }
      }
    }
  }
  const swr = {
    mutateOneSimulation: jest.fn()
  }

  beforeEach(() => {
    mockErrorNotification.mockReset()

    mockFormula.mockReset()
    mockFormula.mockImplementation(() => <div />)

    mockGetFilesNumbers.mockReset()
    mockGetFilesNumbers.mockImplementation(() => [])
    mockGetMultiplcator.mockReset()

    mockUpdate.mockReset()
    mockTasks.mockReset()
    mockTasks.mockImplementation(() => [])

    swr.mutateOneSimulation.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Initialization
        simulations={simulations}
        simulation={simulation}
        swr={swr}
      />
    )

    unmount()
  })

  test('render 2d', () => {
    const { unmount } = render(
      <Initialization
        simulations={simulations}
        simulation={{
          ...simulation,
          scheme: {
            ...simulation.scheme,
            configuration: {
              ...simulation.scheme.configuration,
              dimension: 2
            }
          }
        }}
        swr={swr}
      />
    )

    unmount()
  })

  test('initial value', async () => {
    const { unmount } = render(
      <Initialization
        simulations={simulations}
        simulation={{
          ...simulation,
          scheme: {
            ...simulation.scheme,
            configuration: {
              ...simulation.scheme.configuration,
              //@ts-ignore
              initialization: {
                ...simulation.scheme.configuration.initialization,
                value: {
                  simulation: 'id',
                  type: 'coupling'
                }
              }
            }
          }
        }}
        swr={swr}
      />
    )

    unmount()
  })

  test('onSelectorChange', async () => {
    const { unmount } = render(
      <Initialization
        simulations={simulations}
        simulation={simulation}
        swr={swr}
      />
    )

    const select = screen.getByRole('combobox')
    fireEvent.mouseDown(select)

    // Normal
    const coupling = screen.getByText('Coupling')
    fireEvent.click(coupling)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    const direct = screen.getByText('Velocity')
    fireEvent.click(direct)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('onChange', async () => {
    mockFormula.mockImplementation((props) => (
      <div role="Formula" onClick={props.onValueChange} />
    ))
    const { unmount } = render(
      <Initialization
        simulations={simulations}
        simulation={simulation}
        swr={swr}
      />
    )

    // Open
    const select = screen.getAllByRole('combobox')
    fireEvent.mouseDown(select[0])

    const direct = screen.getByText('Velocity')
    fireEvent.click(direct)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))

    await waitFor(() => screen.getAllByRole('Formula'))

    // Click formula
    const formulas = screen.getAllByRole('Formula')
    fireEvent.click(formulas[0])
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    fireEvent.click(formulas[0])
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.update,
        new Error('update error')
      )
    )

    unmount()
  })

  const setTasksResults = () => {
    mockTasks.mockImplementation(() => [
      {},
      { file: { type: 'mesh' } },
      {
        files: [
          { type: 'mesh' },
          { type: 'result' },
          {
            type: 'result',
            number: 0,
            fileName: 'result_0.vtu'
          },
          {
            type: 'result',
            number: 1,
            fileName: 'result_1.vtu'
          }
        ],
        file: {
          type: 'result',
          fileName: 'result.vtu'
        }
      }
    ])
  }

  test('onCouplingChange', async () => {
    mockGetFilesNumbers.mockImplementation(() => [
      {
        type: 'result',
        number: 0,
        fileName: 'result_0.vtu'
      },
      {
        type: 'result',
        number: 1,
        fileName: 'result_1.vtu'
      }
    ])
    mockGetMultiplcator.mockImplementation(() => 1)
    setTasksResults()
    const { unmount } = render(
      <Initialization
        simulations={simulations}
        simulation={simulation}
        swr={swr}
      />
    )

    // Open coupling
    const select = screen.getByRole('combobox')
    fireEvent.mouseDown(select)

    const coupling = screen.getByText('Coupling')
    fireEvent.click(coupling)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )

    await waitFor(() => {
      const selects = screen.getAllByRole('combobox')
      expect(selects.length).toBe(2)
    })

    // Click simulation select
    const selects = screen.getAllByRole('combobox')
    fireEvent.mouseDown(selects[1])

    const options1 = screen.getAllByText('Simulation 1')
    const option1 = options1[0]

    const options3 = screen.getAllByText('Simulation 3')
    const option3 = options3[0]

    fireEvent.click(option3)
    await waitFor(() => expect(mockTasks).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(0))

    // Normal
    fireEvent.click(option1)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(3))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(3)
    )
    await waitFor(() => expect(mockTasks).toHaveBeenCalledTimes(4))

    // Results
    const newSelects = screen.getAllByRole('combobox')
    const resultSelect = newSelects[2]
    fireEvent.mouseDown(resultSelect)

    const resultOptions0 = screen.getAllByText('0')
    const resultOption0 = resultOptions0[0]

    const resultOptions1 = screen.getAllByText('1')
    const resultOption1 = resultOptions1[0]

    // Error

    fireEvent.click(resultOption0)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(4))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(4)
    )

    // Normal
    mockUpdate.mockImplementation(() => {
      throw new Error('Update error')
    })
    fireEvent.click(resultOption1)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(5))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('onCouplingChange, without files', async () => {
    mockTasks.mockImplementation(() => [{ files: [] }])
    const { unmount } = render(
      <Initialization
        simulations={simulations}
        simulation={simulation}
        swr={swr}
      />
    )

    // Open
    const select = screen.getAllByRole('combobox')
    fireEvent.mouseDown(select[0])

    const velocity = screen.getByText('Velocity')
    fireEvent.click(velocity)

    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )

    await waitFor(() => screen.getByText('Coupling'))

    const coupling = screen.getByText('Coupling')
    fireEvent.click(coupling)

    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(2)
    )

    unmount()
  })

  test('onCouplingChange, without multiplicator', async () => {
    setTasksResults()
    mockGetFilesNumbers.mockImplementation(() => [
      {
        type: 'result',
        number: 0,
        fileName: 'result_0.vtu'
      },
      {
        type: 'result',
        number: 1,
        fileName: 'result_1.vtu'
      }
    ])
    const simulations2: Pick<
      IFrontSimulationsItem,
      'id' | 'name' | 'scheme'
    >[] = [
      {
        id: 'id',
        name: 'Simulation 0',
        scheme: {
          category: 'category',
          name: 'name',
          code: 'code',
          version: 'version',
          description: 'description',
          algorithm: 'algorithm1',
          //@ts-ignore
          configuration: undefined
        }
      },
      {
        id: 'id1',
        name: 'Simulation 1',
        scheme: {
          category: 'category',
          name: 'name',
          code: 'code',
          version: 'version',
          description: 'description',
          algorithm: 'algorithm1',
          //@ts-ignore
          configuration: {
            parameters: {
              index: 1,
              title: 'Parameters',
              time: {
                label: 'Time',
                children: [
                  {
                    label: 'label',
                    htmlEntity: 'entity',
                    default: 0
                  },
                  { label: 'label', htmlEntity: 'entity', default: 1 }
                ]
              }
            },
            run: {
              index: 5,
              title: 'Run',
              resultsFilter: {
                name: 'Time',
                prefixPattern: 'result_',
                suffixPattern: '.vtu',
                pattern: 'result_\\d+.vtu'
              }
            }
          }
        }
      },
      {
        id: 'id2',
        name: 'Simulation 2',
        scheme: {
          category: 'category',
          name: 'name',
          code: 'code',
          version: 'version',
          description: 'description',
          algorithm: 'algorithm2',
          //@ts-ignore
          configuration: undefined
        }
      }
    ]

    const { unmount } = render(
      <Initialization
        simulations={simulations2}
        simulation={simulation}
        swr={swr}
      />
    )

    // Open
    const select = screen.getAllByRole('combobox')
    fireEvent.mouseDown(select[0])

    const velocity = screen.getByText('Velocity')
    fireEvent.click(velocity)

    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )

    await waitFor(() => screen.getByText('Coupling'))

    const coupling = screen.getByText('Coupling')
    fireEvent.click(coupling)

    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(2)
    )

    // Click simulation select
    await waitFor(() => {
      const selects = screen.getAllByRole('combobox')
      expect(selects.length).toBe(2)
    })
    const selects = screen.getAllByRole('combobox')
    fireEvent.mouseDown(selects[1])

    const options1 = screen.getAllByText('Simulation 1')
    const option1 = options1[0]

    fireEvent.click(option1)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(3))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(3)
    )
    await waitFor(() => expect(mockTasks).toHaveBeenCalledTimes(2))

    unmount()
  })

  test('onCouplingChange - error', async () => {
    mockGetFilesNumbers.mockImplementation(() => [
      {
        type: 'result',
        number: 0,
        fileName: 'result_0.vtu'
      },
      {
        type: 'result',
        number: 1,
        fileName: 'result_1.vtu'
      }
    ])
    mockGetMultiplcator.mockImplementation(() => 1)
    setTasksResults()
    const { unmount } = render(
      <Initialization
        simulations={simulations}
        simulation={simulation}
        swr={swr}
      />
    )

    // Open
    const select = screen.getAllByRole('combobox')
    fireEvent.mouseDown(select[0])

    const velocity = screen.getByText('Velocity')
    fireEvent.click(velocity)

    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )

    await waitFor(() => screen.getByText('Coupling'))

    const coupling = screen.getByText('Coupling')
    fireEvent.click(coupling)

    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(2)
    )

    // Click simulation select
    await waitFor(() => {
      const selects = screen.getAllByRole('combobox')
      expect(selects.length).toBe(2)
    })
    const selects = screen.getAllByRole('combobox')
    fireEvent.mouseDown(selects[1])

    const options1 = screen.getAllByText('Simulation 1')
    const option1 = options1[0]

    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    fireEvent.click(option1)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(3))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('no direct, no coupling, no value', () => {
    const { unmount } = render(
      <Initialization
        simulations={simulations}
        simulation={{
          id: 'id',
          scheme: {
            category: 'category',
            name: 'name',
            algorithm: 'algorithm',
            code: 'code',
            version: 'version',
            description: 'description',
            //@ts-ignore
            configuration: {
              geometry: {
                title: 'Geometry',
                index: 0,
                meshable: false
              },
              parameters: {
                index: 1,
                title: 'Parameters',
                time: {
                  label: 'Time',
                  children: [
                    {
                      label: 'label',
                      htmlEntity: 'entity',
                      default: 0
                    },
                    {
                      label: 'label',
                      htmlEntity: 'entity',
                      default: 0,
                      value: 0.1
                    }
                  ]
                }
              },
              initialization: {
                index: 4,
                title: 'Initialization',
                done: true
              }
            }
          }
        }}
        swr={swr}
      />
    )

    unmount()
  })

  test('with value.values', async () => {
    mockFormula.mockImplementation((props) => (
      <div role="Formula" onClick={props.onValueChange} />
    ))

    const { unmount } = render(
      <Initialization
        simulations={simulations}
        simulation={{
          id: 'id',
          scheme: {
            category: 'category',
            name: 'name',
            algorithm: 'algorithm',
            code: 'code',
            version: 'version',
            description: 'description',
            //@ts-ignore
            configuration: {
              geometry: {
                title: 'Geometry',
                index: 0,
                meshable: false
              },
              parameters: {
                index: 1,
                title: 'Parameters',
                time: {
                  label: 'Time',
                  children: [
                    {
                      label: 'label',
                      htmlEntity: 'entity',
                      default: 0
                    },
                    {
                      label: 'label',
                      htmlEntity: 'entity',
                      default: 0,
                      value: 0.1
                    }
                  ]
                }
              },
              initialization: {
                index: 4,
                title: 'Initialization',
                done: true,
                direct: {
                  label: 'Velocity',
                  children: [
                    {
                      label: 'Ux',
                      htmlEntity: 'formula',
                      default: 0,
                      value: 0,
                      unit: '\\(m.s^{-1}\\)'
                    },
                    {
                      label: 'Uy',
                      htmlEntity: 'formula',
                      default: 0,
                      unit: '\\(m.s^{-1}\\)'
                    },
                    {
                      only3D: true,
                      label: 'Uz',
                      htmlEntity: 'formula',
                      default: 0,
                      unit: '\\(m.s^{-1}\\)'
                    }
                  ]
                },
                //@ts-ignore
                value: {
                  values: []
                }
              }
            }
          }
        }}
        swr={swr}
      />
    )

    // Open
    const select = screen.getAllByRole('combobox')
    fireEvent.mouseDown(select[0])

    const direct = screen.getByText('Velocity')
    fireEvent.click(direct)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))

    await waitFor(() => screen.getAllByRole('Formula'))

    // Click formula
    const formulas = screen.getAllByRole('Formula')
    fireEvent.click(formulas[0])
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))

    unmount()
  })
})
