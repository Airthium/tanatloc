import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Data, { errors } from '..'
import { ISelectState, SelectContext } from '@/context/select'

jest.mock('recharts', () => ({
  CartesianGrid: () => <div />,
  Legend: () => <div />,
  LineChart: (props: any) => <div>{props.children}</div>,
  Line: () => <div />,
  ResponsiveContainer: (props: any) => <div>{props.children}</div>,
  Tooltip: () => <div />,
  XAxis: () => <div />,
  YAxis: (props: any) => {
    props.tickFormatter(1)
    return <div />
  }
}))

const mockErrorNotification = jest.fn()
jest.mock('@/context/notification/actions', () => ({
  addError: ({ title, err }: { title: string; err: Error }) =>
    mockErrorNotification(title, err)
}))

jest.mock('@/lib/utils', () => ({
  colorGenerator: () => jest.fn()
}))

const mockSimulation = jest.fn()
jest.mock('@/api/simulation', () => ({
  useSimulation: () => [mockSimulation()]
}))

describe('components/project/data', () => {
  const contextValue = {
    data: true,
    dispatch: jest.fn
  } as unknown as ISelectState

  const simulation = { id: 'id', name: 'name' }

  beforeEach(() => {
    mockErrorNotification.mockReset()

    mockSimulation.mockReset()
    mockSimulation.mockImplementation(() => ({ tasks: [] }))
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

  test('default simulation', () => {
    const data = { id: '0' }
    mockSimulation.mockImplementation(() => data)

    const { unmount } = render(
      <SelectContext.Provider value={contextValue}>
        <Data simulation={simulation} />
      </SelectContext.Provider>
    )

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

    const { unmount } = render(
      <SelectContext.Provider value={contextValue}>
        <Data simulation={simulation} />
      </SelectContext.Provider>
    )

    // Checkbox
    const checkboxes = screen.getAllByTestId('table-checkbox')
    fireEvent.click(checkboxes[0])
    fireEvent.click(checkboxes[1])
    fireEvent.click(checkboxes[0])

    // Close
    const closeButton = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeButton)

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
              names: ['data name', 'data_name2', 'data_name3'],
              x: 1,
              ys: [1, 2, 3]
            }
          ]
        },
        {}
      ]
    }
    mockSimulation.mockImplementation(() => data)

    const { unmount } = render(
      <SelectContext.Provider value={contextValue}>
        <Data simulation={simulation} />
      </SelectContext.Provider>
    )

    // Checkbox
    const checkboxes = screen.getAllByTestId('table-checkbox')
    fireEvent.click(checkboxes[0])
    fireEvent.click(checkboxes[1])
    fireEvent.click(checkboxes[0])

    // Close
    const closeButton = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeButton)

    unmount()
  })

  test('exportCSV', async () => {
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

    const { unmount } = render(
      <SelectContext.Provider value={contextValue}>
        <Data simulation={simulation} />
      </SelectContext.Provider>
    )

    Object.defineProperty(window, 'URL', {
      value: {
        createObjectURL: jest.fn()
      },
      configurable: true
    })

    // Download
    const exportCSV = screen.getByRole('button', { name: 'Export CSV' })
    fireEvent.click(exportCSV)

    const ellispsis = screen.getByRole('button', { name: 'ellipsis' })
    fireEvent.mouseOver(ellispsis)

    await waitFor(() => screen.getByText('Separator: tab'))

    const tab = screen.getByText('Separator: tab')
    fireEvent.click(tab)

    const comma = screen.getByText('Separator: comma')
    fireEvent.click(comma)

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

    fireEvent.click(tab)
    fireEvent.click(comma)

    unmount()
  })
})
