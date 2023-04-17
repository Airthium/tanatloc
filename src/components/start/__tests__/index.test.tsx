import { render, screen } from '@testing-library/react'

import Start from '..'

const mockElectron = jest.fn()
jest.mock('is-electron', () => () => mockElectron())

jest.mock('../../loading', () => (props: any) => (
  <div>
    <div>{JSON.stringify(props.status)}</div>
    <div>{JSON.stringify(props.errors)}</div>
  </div>
))

describe('components/start', () => {
  beforeEach(() => {
    mockElectron.mockReset()
    mockElectron.mockImplementation(() => false)
  })

  test('render', () => {
    const { unmount } = render(<Start />)

    unmount()
  })

  test('electron - error', () => {
    mockElectron.mockImplementation(() => true)
    const { unmount } = render(<Start />)

    expect(
      screen.getByText(
        '["Cannot read properties of undefined (reading \'handleStatus\')"]'
      )
    )

    unmount()
  })

  test('electron - status, err', () => {
    mockElectron.mockImplementation(() => true)
    Object.defineProperty(window, 'electronAPI', {
      value: {
        handleStatus: (callback: Function) =>
          callback('', ['status1', 'status2']),
        handleErrors: (callback: Function) => callback('', ['error1', 'error2'])
      }
    })
    const { unmount } = render(<Start />)

    expect(screen.getByText('["status1","status2"]'))
    expect(screen.getByText('["error1","error2"]'))

    unmount()
  })
})
