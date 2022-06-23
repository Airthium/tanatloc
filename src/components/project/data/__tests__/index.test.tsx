import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Data, { errors } from '..'

const mockDownloadButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  DownloadButton: (props: any) => mockDownloadButton(props)
}))

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

jest.mock('@/lib/utils', () => ({
  stringToColor: () => jest.fn()
}))

const mockSimulation = jest.fn()
jest.mock('@/api/simulation', () => ({
  useSimulation: () => [mockSimulation()]
}))

describe('components/project/data', () => {
  const simulation = { id: 'id', name: 'name' }

  beforeEach(() => {
    mockDownloadButton.mockReset()
    mockDownloadButton.mockImplementation(() => <div />)

    mockErrorNotification.mockReset()

    mockSimulation.mockReset()
    mockSimulation.mockImplementation(() => ({}))
  })

  test('render', () => {
    const { unmount } = render(<Data simulation={simulation} />)

    unmount()
  })

  test('no simulation', () => {
    const { unmount } = render(<Data />)

    unmount()
  })

  test('no data', () => {
    const data = { tasks: [{ datas: [] }] }
    mockSimulation.mockImplementation(() => data)

    const { unmount } = render(<Data simulation={simulation} />)

    unmount()
  })

  test('no data names (old format)', () => {
    const data = {
      tasks: [
        {
          datas: [
            {
              name: 'name'
            }
          ]
        }
      ]
    }
    mockSimulation.mockImplementation(() => data)

    const { unmount } = render(<Data simulation={simulation} />)

    unmount()
  })

  test('with data', () => {
    const data = {
      tasks: [
        {
          datas: [
            {
              names: ['data name', 'data_name2'],
              x: 0,
              ys: [0, 0]
            },
            {
              names: ['data name', 'data_name2'],
              x: 1,
              ys: [1, 2]
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

    // Close
    const closeButton = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeButton)

    unmount()
  })

  test('exportCSV', () => {
    mockDownloadButton.mockImplementation((props) => (
      <div role="DownloadButton" onClick={props.onDownload} />
    ))
    const data = {
      tasks: [
        {
          datas: [
            {
              names: ['data name', 'data name 2'],
              x: 0,
              ys: [0, 2]
            }
          ]
        },
        {}
      ]
    }
    mockSimulation.mockImplementation(() => data)

    const { unmount } = render(<Data simulation={simulation} />)

    Object.defineProperty(window, 'URL', {
      value: {
        createObjectURL: jest.fn()
      },
      configurable: true
    })

    // Visible
    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Download
    const exportCSV = screen.getByRole('DownloadButton')
    fireEvent.click(exportCSV)

    // Error
    Object.defineProperty(window, 'URL', {
      value: {
        createObjectURL: () => {
          throw new Error('createObjectURL error')
        }
      },
      configurable: true
    })
    fireEvent.click(exportCSV)
    expect(mockErrorNotification).toHaveBeenCalledTimes(1)
    expect(mockErrorNotification).toHaveBeenLastCalledWith(
      errors.download,
      new Error('createObjectURL error')
    )

    unmount()
  })
})
