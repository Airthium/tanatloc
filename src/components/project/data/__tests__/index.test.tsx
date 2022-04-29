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
