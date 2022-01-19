import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { ISimulation } from '@/database/index.d'

import Geometry from '..'

jest.mock('@/lib/mathjax', () => ({
  mathjaxRefresh: jest.fn
}))

jest.mock('@/components/assets/dialog', () => ({
  DeleteDialog: () => <div />
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

describe('components/project/simulation/geometry', () => {
  const geometries = [{ id: 'id' }]
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
    mockError.mockReset()

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
          { id: 'id', summary: { solids: [], faces: [], edges: [] } }
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
    const button = screen.getByRole('img', { name: 'select' })
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })
})
