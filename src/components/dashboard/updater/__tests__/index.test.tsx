import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Updater from '..'

jest.mock('@/components/assets/dialog', () => (props: any) => (
  <div role="Dialog" onMouseEnter={props.onOk} onMouseLeave={props.onCancel} />
))

const mockNeedUpdate = jest.fn()
jest.mock('@/lib/update', () => ({
  needUpdate: async () => mockNeedUpdate()
}))

describe('components/dashboard/udpater', () => {
  beforeEach(() => {
    mockNeedUpdate.mockReset()
    mockNeedUpdate.mockImplementation(() => ({ needed: false }))
  })

  test('render', () => {
    const { unmount } = render(<Updater />)

    unmount()
  })

  test('error', () => {
    mockNeedUpdate.mockImplementation(() => {
      throw new Error('needUpdate error')
    })
    const { unmount } = render(<Updater />)

    unmount()
  })

  test('update needed', async () => {
    mockNeedUpdate.mockImplementation(() => ({
      needed: true,
      res: {
        tag_name: '1.0.0'
      }
    }))
    const { unmount } = render(<Updater />)

    await waitFor(() => screen.getByRole('Dialog'))

    unmount()
  })

  test('onOk', async () => {
    mockNeedUpdate.mockImplementation(() => ({
      needed: true,
      res: {
        tag_name: '1.0.0'
      }
    }))
    const { unmount } = render(<Updater />)

    await waitFor(() => screen.getByRole('Dialog'))
    const dialog = screen.getByRole('Dialog')
    fireEvent.mouseEnter(dialog)

    unmount()
  })

  test('onCancel', async () => {
    mockNeedUpdate.mockImplementation(() => ({
      needed: true,
      res: {
        tag_name: '1.0.0'
      }
    }))
    const { unmount } = render(<Updater />)

    await waitFor(() => screen.getByRole('Dialog'))
    const dialog = screen.getByRole('Dialog')
    fireEvent.mouseLeave(dialog)

    unmount()
  })
})
