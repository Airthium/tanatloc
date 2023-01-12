import { fireEvent, render, screen } from '@testing-library/react'

import { IFrontGeometriesItem, IFrontSimulationsItem } from '@/api/index.d'

import Sensors from '..'

const mockSensor = jest.fn()
jest.mock('../sensor', () => (props: any) => mockSensor(props))

const mockList = jest.fn()
jest.mock('../list', () => (props: any) => mockList(props))

describe('components/project/simulation/run/sensors', () => {
  const geometries = [] as IFrontGeometriesItem[]
  const simulation = {
    id: 'id',
    scheme: {} as IFrontSimulationsItem['scheme']
  }
  const setVisible = jest.fn()
  const setResult = jest.fn()
  const setPostprocessing = jest.fn()
  const swr = {
    mutateOneSimulation: jest.fn()
  }

  beforeEach(() => {
    mockSensor.mockReset()
    mockSensor.mockImplementation(() => <div />)

    mockList.mockReset()
    mockList.mockImplementation(() => <div />)

    setVisible.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Sensors
        geometries={geometries}
        simulation={simulation}
        setVisible={setVisible}
        setResult={setResult}
        setPostprocessing={setPostprocessing}
        swr={swr}
      />
    )

    unmount()
  })

  test('onAdd', () => {
    const { unmount } = render(
      <Sensors
        geometries={geometries}
        simulation={simulation}
        setVisible={setVisible}
        setResult={setResult}
        setPostprocessing={setPostprocessing}
        swr={swr}
      />
    )

    const add = screen.getByRole('button')
    fireEvent.click(add)

    expect(setVisible).toHaveBeenCalledTimes(1)
    expect(setVisible).toHaveBeenCalledWith(false)

    unmount()
  })

  test('onEdit', () => {
    mockList.mockImplementation((props) => (
      <div role="Edit" onClick={props.onEdit} />
    ))
    const { unmount } = render(
      <Sensors
        geometries={geometries}
        simulation={simulation}
        setVisible={setVisible}
        setResult={setResult}
        setPostprocessing={setPostprocessing}
        swr={swr}
      />
    )

    const edit = screen.getByRole('Edit')
    fireEvent.click(edit)

    expect(setVisible).toHaveBeenCalledTimes(1)
    expect(setVisible).toHaveBeenCalledWith(false)

    unmount()
  })

  test('onClose', () => {
    mockSensor.mockImplementation((props) => (
      <div role="Sensor" onClick={props.onClose} />
    ))
    const { unmount } = render(
      <Sensors
        geometries={geometries}
        simulation={simulation}
        setVisible={setVisible}
        setResult={setResult}
        setPostprocessing={setPostprocessing}
        swr={swr}
      />
    )

    const close = screen.getByRole('Sensor')
    fireEvent.click(close)

    expect(setVisible).toHaveBeenCalledTimes(1)
    expect(setVisible).toHaveBeenCalledWith(true)

    unmount()
  })
})
