import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { IFrontSimulationsItem } from '@/api/index.d'

import Mesh, { errors } from '..'

const mockErrorNotification = jest.fn()
jest.mock('@/context/notification/actions', () => ({
  addError: ({ title, err }: { title: string; err: Error }) =>
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
  const simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'> = {
    id: 'id',
    scheme: {
      configuration: {
        //@ts-ignore
        geometry: {
          children: [
            {
              label: 'Label'
            }
          ]
        }
      }
    }
  }
  const index = 0
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
    const { unmount } = render(
      <Mesh simulation={simulation} index={index} swr={swr} />
    )

    unmount()
  })

  test('with meshParameters', () => {
    const { unmount } = render(
      <Mesh
        simulation={{
          id: 'id',
          scheme: {
            configuration: {
              //@ts-ignore
              geometry: {
                children: [
                  {
                    label: 'Label',
                    meshParameters: {
                      type: 'auto',
                      value: 'normal'
                    }
                  }
                ]
              }
            }
          }
        }}
        index={index}
        swr={swr}
      />
    )

    unmount()
  })

  test('fill', async () => {
    const FormulaRole = 'Formula'
    mockFormula.mockImplementation((props) => (
      <button
        role={FormulaRole}
        onClick={props.onValueChange}
        onMouseMove={props.onUnitChange}
      />
    ))
    const { unmount } = render(
      <Mesh simulation={simulation} index={index} swr={swr} />
    )

    const collapse = screen.getByRole('button', {
      name: 'collapsed Mesh refinement'
    })
    fireEvent.click(collapse)

    const selects = screen.getAllByRole('combobox')
    const select = selects[0]

    // Open select
    await act(() => fireEvent.mouseDown(select))

    // Auto
    const secondSelect = selects[1]

    await act(() => fireEvent.mouseDown(secondSelect))
    const fine = screen.getByText('Fine')

    await act(() => fireEvent.click(fine))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )

    // Manual
    const manual = screen.getByText('Manual')
    await act(() => fireEvent.click(manual))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(4))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(2)
    )

    await waitFor(() => screen.getByRole(FormulaRole))

    const formula = screen.getByRole(FormulaRole)
    await act(() => fireEvent.click(formula))
    await act(() => fireEvent.mouseMove(formula))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(8))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(4)
    )

    expect(mockErrorNotification).toHaveBeenCalledTimes(0)

    delete simulation.scheme.configuration.geometry.children[index]
      .meshParameters

    unmount()
  })

  test('fill - error', async () => {
    const FormulaRole = 'Formula'
    mockFormula.mockImplementation((props) => (
      <button
        role={FormulaRole}
        onClick={() => props.onValueChange(1.1)}
        onMouseMove={props.onUnitChange}
      />
    ))
    const { unmount } = render(
      <Mesh simulation={simulation} index={index} swr={swr} />
    )

    const collapse = screen.getByRole('button', {
      name: 'collapsed Mesh refinement'
    })
    fireEvent.click(collapse)

    const selects = screen.getAllByRole('combobox')
    const select = selects[0]

    // Open select
    await act(() => fireEvent.mouseDown(select))

    // Auto
    const auto = selects[1]
    await act(() => fireEvent.mouseDown(auto))
    // No event trigger (already in auto)

    // Fine
    const fine = screen.getByText('Fine')
    await act(() => fireEvent.click(fine))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )

    // Manual
    const manual = screen.getByText('Manual')
    await act(() => fireEvent.click(manual))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(4))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(2)
    )

    await waitFor(() => screen.getByRole(FormulaRole))

    // Formula
    const formula = screen.getByRole(FormulaRole)
    await act(() => fireEvent.click(formula))
    await act(() => fireEvent.mouseMove(formula))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(8))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(4)
    )

    // Formula error
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    await act(() => fireEvent.click(formula))
    await act(() => fireEvent.mouseMove(formula))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(10))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.update,
        new Error('update error')
      )
    )

    // Auto error
    const newAuto = screen.getByText('Auto')
    await act(() => fireEvent.click(newAuto))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(11))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(3))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.update,
        new Error('update error')
      )
    )

    delete simulation.scheme.configuration.geometry.children[index]
      .meshParameters

    unmount()
  })

  test('set auto', async () => {
    const { unmount } = render(
      <Mesh
        simulation={{
          id: 'id',
          scheme: {
            configuration: {
              //@ts-ignore
              geometry: {
                children: [
                  {
                    label: 'Domain',
                    meshParameters: {
                      type: 'manual',
                      value: '1'
                    }
                  }
                ]
              }
            }
          }
        }}
        index={index}
        swr={swr}
      />
    )

    const collapse = screen.getByRole('button', {
      name: 'collapsed Mesh refinement'
    })
    fireEvent.click(collapse)

    // Open
    const select = screen.getByRole('combobox')
    await act(() => fireEvent.mouseDown(select))

    // Auto
    const automatic = screen.getByText('Auto')
    await act(() => fireEvent.click(automatic))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )

    unmount()
  })

  test('set factor', async () => {
    const { unmount } = render(
      <Mesh
        simulation={{
          id: 'id',
          scheme: {
            configuration: {
              //@ts-ignore
              geometry: {
                children: [
                  {
                    label: 'Domain',
                    meshParameters: {
                      type: 'manual',
                      value: '1'
                    }
                  }
                ]
              }
            }
          }
        }}
        index={index}
        swr={swr}
      />
    )

    const collapse = screen.getByRole('button', {
      name: 'collapsed Mesh refinement'
    })
    fireEvent.click(collapse)

    // Open
    const select = screen.getByRole('combobox')
    await act(() => fireEvent.mouseDown(select))

    // Factor
    const automatic = screen.getByText('Factor')
    await act(() => fireEvent.click(automatic))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )

    unmount()
  })
})
