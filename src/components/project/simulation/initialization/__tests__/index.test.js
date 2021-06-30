import React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'

import Initialization from '..'

const mockFormula = jest.fn()
jest.mock('@/components/assets/formula', () => (props) => mockFormula(props))

describe('components/project/simulation/initialization', () => {
  const simulations = [
    {
      id: 'id',
      name: '1'
    },
    {
      id: 'id2',
      name: '2'
    }
  ]
  const simulation = {
    id: 'id',
    scheme: {
      configuration: {
        initialization: {
          index: 4,
          title: 'Initialization',
          done: true,
          test: {
            label: 'Test',
            children: [
              {
                label: 'Test',
                htmlEntity: 'formula',
                default: 0,
                unit: '\\(m.s^{-1}\\)'
              },
              {
                label: 'Test',
                htmlEntity: 'formula',
                value: 0
              },
              {
                label: 'Test',
                htmlEntity: 'select',
                options: 'SIMULATIONS_LIST'
              },
              {
                label: 'Test',
                htmlEntity: 'select',
                options: [{ value: 'value', label: 'label' }]
              },
              {
                label: 'Test',
                htmlEntity: 'select'
              },
              {
                label: 'Test',
                htmlEntity: 'other'
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
    const collapse = screen.getByRole('img')
    fireEvent.click(collapse)

    // Click formula
    const formulas = screen.getAllByRole('Formula')
    fireEvent.click(formulas[0])

    // Click select
    const selects = screen.getAllByRole('combobox')
    const select = selects[0]
    await act(async () => fireEvent.mouseDown(select))

    const options2 = screen.getAllByText('2')
    const option2 = options2[0]
    await act(async () => fireEvent.click(option2))

    unmount()
  })
})
