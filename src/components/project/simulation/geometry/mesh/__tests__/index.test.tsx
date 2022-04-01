import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Mesh, { errors } from '..'

import { ISimulation } from '@/database/index.d'

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockFormula = jest.fn()
jest.mock(
  '@/components/assets/formula',
  () => (props: any) => mockFormula(props)
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
    mockErrorNotification.mockReset()

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

    await waitFor(() => screen.getByRole('Formula'))

    const formula = screen.getByRole('Formula')
    fireEvent.click(formula)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(3))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(3)
    )

    expect(mockErrorNotification).toHaveBeenCalledTimes(0)

    delete simulation.scheme.configuration.geometry.meshParameters

    unmount()
  })

  test('fill - error', async () => {
    mockFormula.mockImplementation((props) => (
      <div role="Formula" onClick={() => props.onValueChange(1.1)} />
    ))
    const { unmount } = render(<Mesh simulation={simulation} swr={swr} />)

    const selects = screen.getAllByRole('combobox')
    const select = selects[0]

    // Open select
    fireEvent.mouseDown(select)

    // Auto
    const auto = selects[1]
    fireEvent.mouseDown(auto)
    // No event trigger (already in auto)

    // Fine
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

    await waitFor(() => screen.getByRole('Formula'))

    // Formula
    const formula = screen.getByRole('Formula')
    fireEvent.click(formula)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(3))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(3)
    )

    // Formula error
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    fireEvent.click(formula)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(4))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.update,
        new Error('update error')
      )
    )

    // Auto error
    const newAuto = screen.getByText('Automatic')
    fireEvent.click(newAuto)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(5))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.update,
        new Error('update error')
      )
    )

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
