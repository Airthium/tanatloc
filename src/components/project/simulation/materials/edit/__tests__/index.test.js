import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Edit from '@/components/project/simulation/materials/edit'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

describe('components/project/simulation/materials/edit', () => {
  const material = {
    uuid: 'uuid',
    selected: ['uuid1', 'uuid3']
  }
  const simulation = {
    scheme: {
      configuration: {
        materials: {
          values: [{}]
        }
      }
    }
  }
  const part = { solids: [{ uuid: 'uuid1' }, { uuid: 'uuid2' }] }
  const mutateOneSimulation = jest.fn()
  const swr = { mutateOneSimulation }
  const close = jest.fn()

  beforeEach(() => {
    mockError.mockReset()

    mockUpdate.mockReset()

    close.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Edit
        disabled={false}
        material={material}
        simulation={simulation}
        part={part}
        swr={swr}
        close={close}
      />
    )

    unmount()
  })

  // test('onEdit', async () => {
  //   // Normal
  //   await wrapper.find('Button').props().onClick()
  //   expect(mockUpdate).toHaveBeenCalledTimes(1)
  //   expect(mutateOneSimulation).toHaveBeenCalledTimes(1)
  //   expect(close).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(0)

  //   // Error
  //   mockUpdate.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   await wrapper.find('Button').props().onClick()
  //   expect(mockUpdate).toHaveBeenCalledTimes(2)
  //   expect(mutateOneSimulation).toHaveBeenCalledTimes(1)
  //   expect(close).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(1)
  // })
})
