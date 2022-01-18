import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Mesh from '..'

import { ISimulation } from '@/database/index.d'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockFormula = jest.fn()
jest.mock(
  '@/components/assets/formula',
  () => (props: {}) => mockFormula(props)
)

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

describe('components/project/simulation/geometry/mesh', () => {
  const simulation = {
    id: 'id',
    scheme: {
      configuration: {
        geometry: {}
      }
    }
  } as ISimulation
  const swr = {
    mutateOneSimulation: jest.fn()
  }

  beforeEach(() => {
    mockError.mockReset()

    mockFormula.mockReset()
    mockFormula.mockImplementation(() => <div />)

    mockUpdate.mockReset()

    swr.mutateOneSimulation.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Mesh simulation={simulation} swr={swr} />)

    unmount()
  })

  test('with meshParameters', () => {
    const { unmount } = render(
      <Mesh
        simulation={
          {
            id: 'id',
            scheme: {
              configuration: {
                geometry: {
                  meshParameters: {
                    type: 'auto',
                    value: 'normal'
                  }
                }
              }
            }
          } as ISimulation
        }
        swr={swr}
      />
    )

    unmount()
  })

  test('fill', async () => {
    mockFormula.mockImplementation((props) => (
      <div role="Formula" onClick={props.onValueChange} />
    ))
    const { unmount } = render(<Mesh simulation={simulation} swr={swr} />)

    const selects = screen.getAllByRole('combobox')
    const select = selects[0]

    // Open select
    fireEvent.mouseDown(select)

    // Auto
    const secondSelect = selects[1]

    fireEvent.mouseDown(secondSelect)
    const fine = screen.getByText('Fine')

    fireEvent.click(fine)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )

    // Manual
    const manual = screen.getByText('Manual')
    fireEvent.click(manual)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(2)
    )

    const formula = screen.getByRole('Formula')
    fireEvent.click(formula)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(3))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(3)
    )

    expect(mockError).toHaveBeenCalledTimes(0)

    delete simulation.scheme.configuration.geometry.meshParameters

    unmount()
  })

  test('fill - error', async () => {
    mockFormula.mockImplementation((props) => (
      <div role="Formula" onClick={props.onValueChange} />
    ))
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    const { unmount } = render(<Mesh simulation={simulation} swr={swr} />)

    const selects = screen.getAllByRole('combobox')
    const select = selects[0]

    // Open select
    fireEvent.mouseDown(select)

    // Auto
    const secondSelect = selects[1]

    fireEvent.mouseDown(secondSelect)
    const fine = screen.getByText('Fine')

    fireEvent.click(fine)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(0)
    )
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    // Manual
    const manual = screen.getByText('Manual')
    fireEvent.click(manual)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(0)
    )
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(2))

    const formula = screen.getByRole('Formula')
    fireEvent.click(formula)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(3))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(0)
    )
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(3))

    delete simulation.scheme.configuration.geometry.meshParameters

    unmount()
  })

  test('set auto', async () => {
    const { unmount } = render(
      <Mesh
        simulation={
          {
            id: 'id',
            scheme: {
              configuration: {
                geometry: {
                  meshParameters: {
                    type: 'manual',
                    value: '1'
                  }
                }
              }
            }
          } as ISimulation
        }
        swr={swr}
      />
    )

    // Open
    const select = screen.getByRole('combobox')
    fireEvent.mouseDown(select)

    // Manual
    const automatic = screen.getByText('Automatic')
    fireEvent.click(automatic)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )

    unmount()
  })
})
