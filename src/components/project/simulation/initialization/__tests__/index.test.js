import React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'

import Initialization from '..'

const mockFormula = jest.fn()
jest.mock('@/components/assets/formula', () => (props) => mockFormula(props))

const mockTasks = jest.fn()
jest.mock('@/api/simulation', () => ({
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
          run: {}
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

  beforeEach(() => {
    mockFormula.mockReset()
    mockFormula.mockImplementation(() => <div />)

    mockTasks.mockReset()
    mockTasks.mockImplementation(() => [])
  })

  test('render', () => {
    const { unmount } = render(
      <Initialization simulations={simulations} simulation={simulation} />
    )

    unmount()
  })

  test('onChange', async () => {
    mockFormula.mockImplementation((props) => (
      <div role="Formula" onClick={props.onValueChange} />
    ))
    const { unmount } = render(
      <Initialization simulations={simulations} simulation={simulation} />
    )

    // Open collapse
    const collapse = screen.getAllByRole('img')
    fireEvent.click(collapse[0])
    fireEvent.click(collapse[1])

    // Click formula
    const formulas = screen.getAllByRole('Formula')
    fireEvent.click(formulas[0])

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

    // Click select
    const select = selects[2]
    await act(async () => fireEvent.mouseDown(select))

    {
      const options1 = screen.getAllByText('Simulation 1')
      const option1 = options1[0]
      await act(async () => fireEvent.click(option1))
    }

    unmount()
  })

  test('onCouplingChange', async () => {
    mockFormula.mockImplementation((props) => (
      <div role="Formula" onClick={props.onValueChange} />
    ))
    mockTasks.mockImplementation(() => [
      {},
      { file: { type: 'mesh' } },
      {
        files: [
          { type: 'mesh' },
          {
            type: 'result',
            fileName: 'result_0'
          },
          {
            type: 'result',
            fileName: 'result_1'
          }
        ],
        file: {
          type: 'result',
          fileName: 'result'
        }
      }
    ])
    const { unmount } = render(
      <Initialization simulations={simulations} simulation={simulation} />
    )

    // Open collapse
    const collapse = screen.getAllByRole('img')
    fireEvent.click(collapse[1])

    // Click select
    const selects = screen.getAllByRole('combobox')
    const select = selects[0]
    await act(async () => fireEvent.mouseDown(select))

    const options1 = screen.getAllByText('Simulation 1')
    const option1 = options1[0]
    await act(async () => fireEvent.click(option1))

    unmount()
  })
})
