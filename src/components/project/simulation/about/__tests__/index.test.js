import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import About from '@/components/project/simulation/about'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('@/components/project/simulation/delete', () => () => <div />)

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

describe('components/project/simulation/about', () => {
  const simulation = {
    id: 'id',
    name: 'name'
  }
  const swr = {
    reloadProject: jest.fn(),
    delOneSimulation: jest.fn(),
    mutateOneSimulation: jest.fn()
  }

  beforeEach(() => {
    mockUpdate.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<About simulation={simulation} swr={swr} />)

    unmount()
  })

  test('without simulation', () => {
    const { unmount } = render(<About swr={swr} />)

    unmount()
  })

  test('handleName', async () => {
    const { unmount } = render(<About simulation={simulation} swr={swr} />)

    // Normal
    {
      const button = screen.getByRole('button', { name: 'Edit' })
      fireEvent.click(button)

      const input = screen.getByText('name')
      fireEvent.change(input, { target: { value: 'rename' } })
      fireEvent.keyDown(input, {
        keyCode: 13
      })
      fireEvent.keyUp(input, {
        keyCode: 13
      })

      await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
      await waitFor(() =>
        expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
      )
    }

    // Error
    {
      mockUpdate.mockImplementation(() => {
        throw new Error()
      })
      const button = screen.getByRole('button', { name: 'Edit' })
      fireEvent.click(button)

      const input = screen.getByText('name')
      fireEvent.change(input, { target: { value: 'rename' } })
      fireEvent.keyDown(input, {
        keyCode: 13
      })
      fireEvent.keyUp(input, {
        keyCode: 13
      })

      await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
      await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))
    }

    unmount()
  })
})
