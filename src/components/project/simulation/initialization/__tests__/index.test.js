import React from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import Initialization from '..'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockFormula = jest.fn()
jest.mock('@/components/assets/formula', () => (props) => mockFormula(props))

const mockUpdate = jest.fn()
const mockTasks = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate(),
  tasks: async () => mockTasks()
}))

describe('components/project/simulation/initialization', () => {
  const simulations = [
    {
      id: 'id',
      name: 'Simulation 0',
      scheme: {
        algorithm: 'algorithm1'
      }
    },
    {
      id: 'id1',
      name: 'Simulation 1',
      scheme: {
        algorithm: 'algorithm1',
        configuration: {
          parameters: {
            time: {
              children: [{}, { default: 1 }]
            }
          },
          run: {
            resultsFilters: [
              {
                prefixPattern: 'result_',
                suffixPattern: '.vtu',
                pattern: 'result_\\d+.vtu',
                multiplicator: ['parameters', 'time', 'children', '1']
              }
            ]
          }
        }
      }
    },
    {
      id: 'id2',
      name: 'Simulation 2',
      scheme: {
        algorithm: 'algorithm2'
      }
    },
    {
      id: 'id3',
      name: 'Simulation 3',
      scheme: {
        algorithm: 'algorithm1'
      }
    }
  ]
  const simulation = {
    id: 'id',
    scheme: {
      configuration: {
        parameters: {
          time: {
            children: [
              {},
              {
                value: 0.1
              }
            ]
          }
        },
        initialization: {
          index: 4,
          title: 'Initialization',
          done: true,
          velocity: {
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
                label: 'Uz',
                htmlEntity: 'formula',
                default: 0,
                unit: '\\(m.s^{-1}\\)'
              },
              {
                label: 'Test',
                htmlEntity: 'select',
                options: [
                  { label: 'select_option1', value: 'select_option1' },
                  { label: 'select_option2', value: 'select_option2' }
                ],
                value: 0
              },
              {
                label: 'Test',
                htmlEntity: 'select',
                options: [{ label: 'select', value: 'select' }],
                default: 0
              },
              {
                label: 'Unknown',
                htmlEntity: 'unknown'
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
          }
        }
      }
    }
  }
  const swr = {
    mutateOneSimulation: jest.fn()
  }

  beforeEach(() => {
    mockError.mockReset()

    mockFormula.mockReset()
    mockFormula.mockImplementation(() => <div />)

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

    await waitFor(() =>
      screen.getByText(
        'If you use coupling, the selected simulation mesh will be used, at least for the first iteration.'
      )
    )

    unmount()
  })

  test('onPanelChange', async () => {
    const { unmount } = render(
      <Initialization
        simulations={simulations}
        simulation={simulation}
        swr={swr}
      />
    )

    const tabs = screen.getAllByRole('tab')

    // Normal
    fireEvent.click(tabs[0])
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(tabs[1])
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

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
    const tabs = screen.getAllByRole('tab')
    fireEvent.click(tabs[0])
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))

    // Click formula
    const formulas = screen.getAllByRole('Formula')
    fireEvent.click(formulas[0])
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))

    // Click select
    const selects = screen.getAllByRole('combobox')
    await act(async () => fireEvent.mouseDown(selects[0]))

    {
      const options1 = screen.getAllByText('select_option1')
      const option1 = options1[0]
      await act(async () => fireEvent.click(option1))

      const options2 = screen.getAllByText('select_option2')
      const option2 = options2[0]
      await act(async () => fireEvent.click(option2))
    }

    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(3))

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(formulas[0])
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  const setTasksResults = () => {
    mockTasks.mockImplementation(() => [
      {},
      { file: { type: 'mesh' } },
      {
        files: [
          { type: 'mesh' },
          {
            type: 'result',
            fileName: 'result_0.vtu'
          },
          {
            type: 'result',
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
    setTasksResults()
    const { unmount } = render(
      <Initialization
        simulations={simulations}
        simulation={simulation}
        swr={swr}
      />
    )

    // Open collapse
    const tabs = screen.getAllByRole('tab')
    fireEvent.click(tabs[1])
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )

    // Click select
    const selects = screen.getAllByRole('combobox')
    const select = selects[2]
    await act(async () => fireEvent.mouseDown(select))

    const options1 = screen.getAllByText('Simulation 1')
    const option1 = options1[0]

    const options3 = screen.getAllByText('Simulation 3')
    const option3 = options3[0]

    // Error
    await act(async () => fireEvent.click(option3))
    await waitFor(() => expect(mockTasks).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    // Normal
    await act(async () => fireEvent.click(option1))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(2)
    )
    await waitFor(() => expect(mockTasks).toHaveBeenCalledTimes(2))

    // Results
    const newSelects = screen.getAllByRole('combobox')
    const resultSelect = newSelects[3]
    await act(async () => fireEvent.mouseDown(resultSelect))

    const resultOptions0 = screen.getAllByText('result.vtu')
    const resultOption0 = resultOptions0[0]
    const resultOptions1 = screen.getAllByText('1')
    const resultOption1 = resultOptions1[0]

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('Update error')
    })
    await act(async () => fireEvent.click(resultOption0))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(3))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(2))

    // Normal
    mockUpdate.mockReset()
    await act(async () => fireEvent.click(resultOption1))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(3)
    )

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

    // Open collapse
    const tabs = screen.getAllByRole('tab')
    fireEvent.click(tabs[1])
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )

    unmount()
  })

  test('onCouplingChange, without multiplicator', async () => {
    setTasksResults()
    const simulations2 = [
      {
        id: 'id',
        name: 'Simulation 0',
        scheme: {
          algorithm: 'algorithm1'
        }
      },
      {
        id: 'id1',
        name: 'Simulation 1',
        scheme: {
          algorithm: 'algorithm1',
          configuration: {
            parameters: {
              time: {
                children: [{}, { default: 1 }]
              }
            },
            run: {
              resultsFilters: [
                {
                  prefixPattern: 'result_',
                  suffixPattern: '.vtu',
                  pattern: 'result_\\d+.vtu'
                }
              ]
            }
          }
        }
      },
      {
        id: 'id2',
        name: 'Simulation 2',
        scheme: {
          algorithm: 'algorithm2'
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

    // Open collapse
    const tabs = screen.getAllByRole('tab')
    fireEvent.click(tabs[1])
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )

    unmount()
  })
})
