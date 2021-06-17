import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Data from '..'

jest.mock('@/lib/utils', () => ({
  stringToColor: () => jest.fn()
}))

const mockSimulation = jest.fn()
jest.mock('@/api/simulation', () => ({
  useSimulation: () => [mockSimulation()]
}))

describe('components/project/data', () => {
  const simulation = { id: 'id' }

  beforeEach(() => {
    mockSimulation.mockReset()
    mockSimulation.mockImplementation(() => ({}))
  })

  test('render', () => {
    const { unmount } = render(<Data simulation={simulation} />)

    unmount()
  })

  test('setVisible', () => {
    const { unmount } = render(<Data simulation={simulation} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const drawer = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(drawer)

    unmount()
  })

  test('with data', () => {
    const data = {
      tasks: [
        {
          datas: [
            {
              name: 'data name',
              x: 0,
              y: 0
            },
            {
              name: 'data name',
              x: 1,
              y: 1
            },
            {
              name: 'data name 2',
              x: 0,
              y: 0
            },
            {
              name: 'data name 2',
              x: 2,
              y: 2
            }
          ]
        },
        {}
      ]
    }
    mockSimulation.mockImplementation(() => data)

    const { unmount } = render(<Data simulation={simulation} />)

    // Visible
    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Checkbox
    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[0])
    fireEvent.click(checkboxes[1])
    fireEvent.click(checkboxes[0])

    unmount()
  })

  test('exportCSV', () => {
    const data = {
      tasks: [
        {
          datas: [
            {
              name: 'data name',
              x: 0,
              y: 0
            },
            {
              name: 'data name 2',
              x: 2,
              y: 2
            }
          ]
        },
        {}
      ]
    }
    mockSimulation.mockImplementation(() => data)

    const { unmount } = render(<Data simulation={simulation} />)

    window.URL = {
      createObjectURL: jest.fn()
    }

    // Visible
    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Checkbox
    const exportCSV = screen.getByRole('button', {
      name: 'file-text Export CSV'
    })
    fireEvent.click(exportCSV)

    unmount()
  })
})
