import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { IFrontGeometriesItem, IFrontSimulationsItem } from '@/api/index.d'

import Geometry, { errors } from '..'

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

jest.mock('../mesh', () => () => <div />)

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

jest.mock('../mesh', () => () => <div />)

describe('components/project/simulation/geometry', () => {
  const loadedGeometries = [
    { id: 'id', name: 'geometry', summary: {} },
    { id: 'id2', name: 'other geometry', summary: {} }
  ] as Pick<IFrontGeometriesItem, 'id' | 'name' | 'summary'>[]
  const geometries = [
    { id: 'id', name: 'name', summary: {} } as Pick<
      IFrontGeometriesItem,
      'id' | 'name' | 'summary'
    >
  ]
  const simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'> = {
    id: 'id',
    scheme: {
      category: 'category',
      name: 'name',
      algorithm: 'algorithm',
      code: 'code',
      version: 'version',
      description: 'description',
      //@ts-ignore
      configuration: {
        geometry: {
          index: 1,
          title: 'Geometry',
          meshable: false
        }
      }
    }
  }
  const simulationMultiple: Pick<IFrontSimulationsItem, 'id' | 'scheme'> = {
    id: 'id',
    scheme: {
      category: 'category',
      name: 'name',
      algorithm: 'algorithm',
      code: 'code',
      version: 'version',
      description: 'description',
      //@ts-ignore
      configuration: {
        geometry: {
          index: 1,
          title: 'Geometry',
          meshable: false,
          multiple: true
        }
      }
    }
  }
  const setGeometries = jest.fn()
  const swr = { mutateOneSimulation: jest.fn() }

  beforeEach(() => {
    mockErrorNotification.mockReset()

    mockUpdate.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Geometry
        loadedGeometries={loadedGeometries}
        geometries={geometries}
        simulation={simulation}
        setGeometries={setGeometries}
        swr={swr}
      />
    )

    unmount()
  })

  test('without loadedGeometries', () => {
    const { unmount } = render(
      <Geometry
        loadedGeometries={[]}
        geometries={geometries}
        simulation={simulation}
        setGeometries={setGeometries}
        swr={swr}
      />
    )

    unmount()
  })

  test('with geometry value', async () => {
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    const { unmount } = render(
      <Geometry
        loadedGeometries={[
          {
            id: 'id',
            name: 'geometry',
            //@ts-ignore
            summary: {}
          },
          {
            id: 'id2',
            name: 'geometry2',
            //@ts-ignore
            summary: {}
          }
        ]}
        geometries={geometries}
        simulation={{
          id: 'id',
          scheme: {
            category: 'category',
            name: 'name',
            algorithm: 'algorithm',
            code: 'code',
            version: 'version',
            description: 'description',
            //@ts-ignore
            configuration: {
              geometry: {
                index: 1,
                title: 'Geometry',
                meshable: false,
                value: 'id'
              }
            }
          }
        }}
        setGeometries={setGeometries}
        swr={swr}
      />
    )

    // Select error
    const select = screen.getByRole('combobox')
    await act(() => fireEvent.mouseDown(select))

    const option = screen.getByText('geometry2')
    await act(() => fireEvent.click(option))

    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.update,
        new Error('update error')
      )
    )

    unmount()
  })

  test('meshable', () => {
    const { unmount } = render(
      <Geometry
        loadedGeometries={loadedGeometries}
        geometries={geometries}
        simulation={{
          id: 'id',
          scheme: {
            category: 'category',
            name: 'name',
            algorithm: 'algorithm',
            code: 'code',
            version: 'version',
            description: 'description',
            //@ts-ignore
            configuration: {
              geometry: {
                index: 1,
                title: 'Geometry',
                meshable: true
              }
            }
          }
        }}
        setGeometries={setGeometries}
        swr={swr}
      />
    )

    unmount()
  })

  test('multiple', async () => {
    const { unmount } = render(
      <Geometry
        loadedGeometries={[
          {
            id: 'id',
            name: 'geometry',
            //@ts-ignore
            summary: {}
          },
          {
            id: 'id2',
            name: 'geometry2',
            //@ts-ignore
            summary: {}
          }
        ]}
        geometries={geometries}
        simulation={simulationMultiple}
        setGeometries={setGeometries}
        swr={swr}
      />
    )

    const select = screen.getByRole('combobox')
    await act(() => fireEvent.mouseDown(select))

    const option = screen.getByText('geometry2')
    await act(() => fireEvent.click(option))

    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(0))

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    const option2 = screen.getByText('geometry')
    await act(() => fireEvent.click(option2))

    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(3))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.update,
        new Error('update error')
      )
    )

    unmount()
  })

  test('multiple and n', () => {
    const { unmount } = render(
      <Geometry
        loadedGeometries={loadedGeometries}
        geometries={geometries}
        simulation={{
          ...simulationMultiple,
          scheme: {
            ...simulation.scheme,
            configuration: {
              ...simulation.scheme.configuration,
              geometry: {
                ...simulation.scheme.configuration.geometry,
                n: 2
              }
            }
          }
        }}
        setGeometries={setGeometries}
        swr={swr}
      />
    )

    unmount()
  })
})
