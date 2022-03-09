import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { ISimulation } from '@/database/index.d'

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

describe('components/project/simulation/geometry', () => {
  const geometries = [{ id: 'id', name: 'geometry' }]
  const geometry = { id: 'id' }
  const simulation: ISimulation = {
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
          index: 1,
          title: 'Geometry',
          meshable: false
        }
      }
    }
  }
  const setGeometry = jest.fn()
  const swr = { mutateOneSimulation: jest.fn() }

  beforeEach(() => {
    mockErrorNotification.mockReset()

    mockUpdate.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Geometry
        geometries={geometries}
        geometry={geometry}
        simulation={simulation}
        setGeometry={setGeometry}
        swr={swr}
      />
    )

    unmount()
  })

  test('without geometries', () => {
    const { unmount } = render(
      <Geometry
        geometries={[]}
        geometry={geometry}
        simulation={simulation}
        setGeometry={setGeometry}
        swr={swr}
      />
    )

    unmount()
  })

  test('with geometry value', async () => {
    const { unmount } = render(
      <Geometry
        geometries={[
          {
            id: 'id',
            name: 'geometry'
          }
        ]}
        geometry={geometry}
        simulation={{
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
                index: 1,
                title: 'Geometry',
                meshable: false,
                value: 'id'
              }
            }
          }
        }}
        setGeometry={setGeometry}
        swr={swr}
      />
    )

    // Select error
    const button = screen.getByText('geometry')
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    fireEvent.click(button)
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
        geometries={geometries}
        geometry={geometry}
        simulation={{
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
                index: 1,
                title: 'Geometry',
                meshable: true
              }
            }
          }
        }}
        setGeometry={setGeometry}
        swr={swr}
      />
    )

    unmount()
  })
})
