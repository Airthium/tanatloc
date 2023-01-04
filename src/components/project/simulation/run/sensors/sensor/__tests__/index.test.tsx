import { fireEvent, render, screen } from '@testing-library/react'

import Sensor from '..'

import { IFrontSimulationsItem } from '@/api/index.d'

const mockFormula = jest.fn()
jest.mock(
  '@/components/assets/formula',
  () => (props: any) => mockFormula(props)
)

const mockCancelButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  CancelButton: (props: any) => mockCancelButton(props)
}))

const mockEdit = jest.fn()
jest.mock('../../edit', () => (props: any) => mockEdit(props))

const mockAdd = jest.fn()
jest.mock('../../add', () => (props: any) => mockAdd(props))

describe('components/project/simulation/run/sensors/sensor', () => {
  const visible = true
  const simulation = {
    id: 'id',
    scheme: { configuration: { run: {} } } as IFrontSimulationsItem['scheme']
  }
  const sensor = {
    index: 0,
    name: 'name',
    point: { x: 0, y: 1, z: 2 },
    formula: 'formula'
  }
  const onClose = jest.fn()
  const swr = {
    mutateOneSimulation: jest.fn()
  }

  beforeEach(() => {
    mockFormula.mockReset()
    mockFormula.mockImplementation(() => <div />)

    mockCancelButton.mockReset()
    mockCancelButton.mockImplementation(() => <div />)

    mockEdit.mockReset()
    mockEdit.mockImplementation(() => <div />)

    mockAdd.mockReset()
    mockAdd.mockImplementation(() => <div />)

    onClose.mockReset()
    swr.mutateOneSimulation.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Sensor
        visible={visible}
        simulation={simulation}
        onClose={onClose}
        swr={swr}
      />
    )

    unmount()
  })

  test('render, with sensors', () => {
    const { unmount } = render(
      <Sensor
        visible={visible}
        simulation={{
          ...simulation,
          scheme: {
            configuration: {
              run: {
                sensors: [
                  {
                    name: 'name',
                    point: { x: 0, y: 1, z: 2 },
                    formula: 'formula'
                  }
                ]
              }
            }
          } as IFrontSimulationsItem['scheme']
        }}
        onClose={onClose}
        swr={swr}
      />
    )

    unmount()
  })

  test('render, with sensor', () => {
    const { unmount } = render(
      <Sensor
        visible={visible}
        simulation={simulation}
        sensor={sensor}
        onClose={onClose}
        swr={swr}
      />
    )

    unmount()
  })

  test('selection', () => {
    const { unmount } = render(
      <Sensor
        visible={visible}
        simulation={simulation}
        onClose={onClose}
        swr={swr}
      />
    )

    const button = screen.getByRole('button', { name: 'pushpin' })
    fireEvent.click(button)

    fireEvent.click(button)

    unmount()
  })

  test('name', () => {
    const { unmount } = render(
      <Sensor
        visible={visible}
        simulation={simulation}
        onClose={onClose}
        swr={swr}
      />
    )

    const name = screen.getByRole('textbox')
    fireEvent.input(name, { target: { value: 'name' } })

    unmount()
  })

  test('formulas', () => {
    mockFormula.mockImplementation((props) => (
      <div role="Formula" onClick={props.onValueChange} />
    ))
    const { unmount } = render(
      <Sensor
        visible={visible}
        simulation={simulation}
        onClose={onClose}
        swr={swr}
      />
    )

    const formulas = screen.getAllByRole('Formula')

    fireEvent.click(formulas[0])
    fireEvent.click(formulas[1])
    fireEvent.click(formulas[2])
    fireEvent.click(formulas[3])

    unmount()
  })

  test('error', () => {
    mockAdd.mockImplementation((props) => (
      <div role="Add" onClick={() => props.onError('error')} />
    ))
    const { unmount } = render(
      <Sensor
        visible={visible}
        simulation={simulation}
        onClose={onClose}
        swr={swr}
      />
    )

    const add = screen.getByRole('Add')
    fireEvent.click(add)

    unmount()
  })

  test('close', () => {
    const { unmount } = render(
      <Sensor
        visible={visible}
        simulation={simulation}
        onClose={onClose}
        swr={swr}
      />
    )

    const close = screen.getByRole('button', { name: 'close' })
    fireEvent.click(close)

    unmount()
  })
})
