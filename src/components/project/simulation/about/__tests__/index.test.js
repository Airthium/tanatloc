import React from 'react'
import { MathJaxContext } from 'better-react-mathjax'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import About from '@/components/project/simulation/about'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('../../copy', () => () => <div />)

jest.mock('../../delete', () => () => <div />)

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

describe('components/project/simulation/about', () => {
  const project = {
    id: 'id',
    simulations: ['id']
  }
  const simulation = {
    id: 'id',
    name: 'name'
  }
  const swr = {
    mutateProject: jest.fn(),
    addOneSimulation: jest.fn(),
    delOneSimulation: jest.fn(),
    mutateOneSimulation: jest.fn()
  }

  beforeEach(() => {
    mockUpdate.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <MathJaxContext>
        <About project={project} simulation={simulation} swr={swr} />
      </MathJaxContext>
    )

    unmount()
  })

  test('without simulation', () => {
    const { unmount } = render(
      <MathJaxContext>
        <About project={project} swr={swr} />
      </MathJaxContext>
    )

    unmount()
  })

  test('handleName', async () => {
    const { unmount } = render(
      <MathJaxContext>
        <About project={project} simulation={simulation} swr={swr} />
      </MathJaxContext>
    )

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
