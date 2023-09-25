import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { IFrontSimulationsItem } from '@/api/index.d'

import Parameters, { errors } from '@/components/project/simulation/parameters'

const mockFormula = jest.fn()
jest.mock(
  '@/components/assets/formula',
  () => (props: any) => mockFormula(props)
)

const mockErrorNotification = jest.fn()
jest.mock('@/context/notification/actions', () => ({
  addError: ({ title, err }: { title: string; err: Error }) =>
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
        geometry: {
          index: 0,
          title: 'Geometry',
          meshable: true
        },
        parameters: {
          index: 0,
          title: 'title',
          param1: {
            label: 'param1',
            children: [
              {
                label: 'Formula1',
                htmlEntity: 'formula',
                default: 0
              },
              {
                label: 'Formula2',
                htmlEntity: 'formula',
                value: 1,
                default: 0
              },
              {
                only3D: true,
                label: 'Formula3',
                htmlEntity: 'formula',
                value: 1,
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
                htmlEntity: 'formula',
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
              },
              {
                label: 'Radio',
                htmlEntity: 'radio',
                options: [
                  { label: 'option1', value: 0 },
                  { label: 'option2', value: 1 }
                ],
                default: 0
              },
              {
                label: 'Other',
                //@ts-ignore
                htmlEntity: 'other',
                default: 0
              }
            ]
          }
        },
        boundaryConditions: {
          index: 0,
          title: 'Boundary Conditions'
        },
        run: {
          index: 0,
          title: 'Run'
        }
      }
    }
  } as Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  const swr = { mutateOneSimulation: jest.fn() }

  beforeEach(() => {
    mockFormula.mockReset()
    mockFormula.mockImplementation(() => <div />)

    mockErrorNotification.mockReset()

    mockUpdate.mockReset()
  })

  test('render', async () => {
    const { unmount } = render(<Parameters simulation={simulation} swr={swr} />)

    // Open advanced
    const open = screen.getByRole('button', { name: 'right Advanced' })
    await act(() => fireEvent.click(open))

    unmount()
  })

  test('render - done', () => {
    const { unmount } = render(
      <Parameters
        simulation={{
          ...simulation,
          scheme: {
            ...simulation.scheme,
            configuration: {
              ...simulation.scheme.configuration,
              parameters: {
                index: 0,
                title: 'title',
                param1: {
                  label: 'param1',
                  children: [
                    {
                      label: 'Formula1',
                      htmlEntity: 'formula',
                      default: 0
                    },
                    {
                      label: 'Formula2',
                      htmlEntity: 'formula',
                      value: 1,
                      default: 0
                    },
                    {
                      only3D: true,
                      label: 'Formula3',
                      htmlEntity: 'formula',
                      value: 1,
                      default: 0
                    }
                  ]
                },
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

  test('onDone error', async () => {
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })

    const { unmount } = render(<Parameters simulation={simulation} swr={swr} />)

    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('with value', () => {
    //@ts-ignore
    simulation.scheme.configuration.parameters.param2.children[0].value = 0
    const { unmount } = render(<Parameters simulation={simulation} swr={swr} />)

    unmount()
  })

  test('onChange', async () => {
    let value: number | undefined = 0
    mockFormula.mockImplementation((props) => (
      <div
        role="Formula"
        onClick={() => props.onValueChange(value)}
        onMouseMove={() => props.onUnitChange({})}
      />
    ))
    const { unmount } = render(<Parameters simulation={simulation} swr={swr} />)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))

    // Formula
    const formulas = screen.getAllByRole('Formula')
    await act(() => fireEvent.click(formulas[0]))
    await act(() => fireEvent.mouseMove(formulas[0]))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(6))

    // Update error
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    value = undefined
    await act(() => fireEvent.click(formulas[1]))
    await act(() => fireEvent.mouseMove(formulas[1]))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(8))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.update,
        new Error('update error')
      )
    )
    mockUpdate.mockImplementation(() => {
      // Empty
    })

    // Open advanced
    const open = screen.getByRole('button', { name: 'right Advanced' })
    await act(() => fireEvent.click(open))

    // Select
    const select = screen.getByRole('combobox')
    await act(() => fireEvent.mouseDown(select))

    const options2 = screen.getAllByText('option2')
    const option2 = options2[1]
    await act(() => fireEvent.click(option2))

    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(8))

    // Checkbox
    const checkbox = screen.getByRole('checkbox')
    await act(() => fireEvent.click(checkbox))

    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(10))

    unmount()
  })

  test('2D', async () => {
    mockFormula.mockImplementation((props) => (
      <div
        role="Formula"
        onClick={() => props.onValueChange()}
        onMouseMove={() => props.onUnitChange({})}
      />
    ))
    simulation.scheme.configuration.dimension = 2
    //@ts-ignore
    simulation.scheme.configuration.parameters.param2.children[0].value =
      undefined
    const { unmount } = render(<Parameters simulation={simulation} swr={swr} />)

    // Formula
    const formulas = screen.getAllByRole('Formula')
    await act(() => fireEvent.click(formulas[0]))
    await act(() => fireEvent.mouseMove(formulas[0]))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(6))

    // Open advanced
    const open = screen.getByRole('button', { name: 'right Advanced' })
    await act(() => fireEvent.click(open))

    // Select
    const select = screen.getByRole('combobox')
    await act(() => fireEvent.mouseDown(select))

    const options2 = screen.getAllByText('option2')
    const option2 = options2[1]
    await act(() => fireEvent.click(option2))

    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(8))

    // Checkbox
    const checkbox = screen.getByRole('checkbox')
    await act(() => fireEvent.click(checkbox))

    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(10))

    unmount()
  })
})
