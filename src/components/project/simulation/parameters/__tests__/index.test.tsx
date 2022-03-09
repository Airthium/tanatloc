import React from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import Parameters, { errors } from '@/components/project/simulation/parameters'

const mockFormula = jest.fn()
jest.mock('@/components/assets/formula', () => (props) => mockFormula(props))

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

describe('components/project/simulation/parameters', () => {
  const simulation = {
    id: 'id',
    scheme: {
      category: 'category',
      name: 'name',
      algorithm: 'algorithm',
      code: 'code',
      version: 'version',
      description: 'description',
      configuration: {
        parameters: {
          index: 0,
          title: 'title',
          param1: {
            label: 'param1',
            children: [
              {
                label: 'Formula',
                htmlEntity: 'formula',
                default: 0
              }
            ]
          },
          param2: {
            label: 'param2',
            advanced: true,
            children: [
              {
                label: 'Select',
                htmlEntity: 'select',
                options: [
                  { label: 'option1', value: 'option1' },
                  { label: 'option2', value: 'option2' }
                ],
                default: 'option1'
              },
              {
                label: 'label',
                htmlEntity: 'entity',
                default: 0
              }
            ]
          },
          param3: {
            label: 'param3',
            children: [
              {
                label: 'Checkbox',
                htmlEntity: 'checkbox',
                default: 0
              }
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

    mockErrorNotification.mockReset()

    mockUpdate.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Parameters simulation={simulation} swr={swr} />)

    unmount()
  })

  test('with value', () => {
    //@ts-ignore
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
      throw new Error('update error')
    })
    value = undefined
    fireEvent.click(formula)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(3))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.update,
        new Error('update error')
      )
    )
    mockUpdate.mockImplementation(() => {})

    // Open advanced
    const open = screen.getByRole('button', { name: 'right Advanced' })
    fireEvent.click(open)

    // Select
    const select = screen.getByRole('combobox')
    await act(async () => {
      fireEvent.mouseDown(select)
    })

    const options2 = screen.getAllByText('option2')
    const option2 = options2[1]
    await act(async () => {
      fireEvent.click(option2)
    })

    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(4))

    // Checkbox
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(5))

    unmount()
  })
})
