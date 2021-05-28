import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Add from '@/components/project/simulation/boundaryConditions/add'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

describe('components/project/simulation/boundaryConditions/add', () => {
  const simulation = {
    scheme: {
      configuration: {
        boundaryConditions: {
          key: {
            values: []
          }
        }
      }
    }
  }
  const boundaryCondition = {
    type: {
      key: 'key'
    },
    selected: ['uuid1', 'uuid3']
  }
  const part = { faces: [{ uuid: 'uuid1' }, { uuid: 'uuid2' }] }
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
      <Add
        disabled={false}
        simulation={simulation}
        boundaryCondition={boundaryCondition}
        part={part}
        swr={swr}
        close={close}
      />
    )

    unmount()
  })

  // test('onAdd', async () => {
  //   await wrapper.find('Button').props().onClick()
  //   expect(mockUpdate).toHaveBeenCalledTimes(1)
  //   expect(mutateOneSimulation).toHaveBeenCalledTimes(1)
  //   expect(close).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(0)

  //   // Without values
  //   wrapper.unmount()
  //   simulation.scheme.configuration.boundaryConditions.key = {}
  //   wrapper = shallow(
  //     <Add
  //       disabled={false}
  //       simulation={simulation}
  //       boundaryCondition={boundaryCondition}
  //       part={part}
  //       swr={swr}
  //       close={close}
  //     />
  //   )
  //   await wrapper.find('Button').props().onClick()

  //   // Error
  //   mockUpdate.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   await wrapper.find('Button').props().onClick()
  //   expect(mockUpdate).toHaveBeenCalledTimes(3)
  //   expect(mutateOneSimulation).toHaveBeenCalledTimes(2)
  //   expect(close).toHaveBeenCalledTimes(2)
  //   expect(mockError).toHaveBeenCalledTimes(1)
  // })
})
