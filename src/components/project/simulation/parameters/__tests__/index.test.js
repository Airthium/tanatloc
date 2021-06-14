import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Parameters from '@/components/project/simulation/parameters'

const mockFormula = jest.fn()
jest.mock('@/components/assets/formula', () => (props) => mockFormula(props))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

describe('components/project/simulation/parameters', () => {
  const simulation = {
    id: 'id',
    scheme: {
      configuration: {
        parameters: {
          index: 0,
          title: 'title',
          param1: {
            label: 'param1',
            children: [
              {
                htmlEntity: 'formula'
              }
            ]
          },
          param2: {
            label: 'param2',
            advanced: true,
            children: [
              {
                htmlEntity: 'select',
                options: [
                  { label: 'option1', value: 'option1' },
                  { label: 'option2', value: 'option2' }
                ],
                default: 'option1'
              },
              {}
            ]
          }
        }
      }
    }
  }
  const swr = { mutateOneSimulation: jest.fn() }

  beforeEach(() => {
    mockFormula.mockReset()
    mockFormula.mockImplementation(() => <div />)

    mockError.mockReset()

    mockUpdate.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Parameters simulation={simulation} swr={swr} />)

    unmount()
  })

  test('with value', () => {
    simulation.scheme.configuration.parameters.param2.children[0].value = 0
    const { unmount } = render(<Parameters simulation={simulation} swr={swr} />)

    unmount()
  })

  test('onChange', async () => {
    let value = 0
    mockFormula.mockImplementation((props) => (
      <div role="Formula" onClick={() => props.onValueChange(value)} />
    ))
    const { unmount } = render(<Parameters simulation={simulation} swr={swr} />)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))

    // Formula
    const formula = screen.getByRole('Formula')
    fireEvent.click(formula)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))

    // Update error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    value = undefined
    fireEvent.click(formula)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(3))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))
    mockUpdate.mockImplementation(() => {})

    // Open advanced
    const open = screen.getByRole('button')
    fireEvent.click(open)

    // TODO
    // // Select
    // const select = screen.getByRole('combobox')
    // fireEvent.mouseDown(select)
    // fireEvent.mouseUp(select)

    // const option2 = screen.getByRole('option', { name: 'option2' })
    // fireEvent.mouseDown(option2)
    // fireEvent.mouseUp(option2)
    // await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(4))

    unmount()
  })
})
