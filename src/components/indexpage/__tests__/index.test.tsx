import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Index from '..'

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

const mockIsElectron = jest.fn()
jest.mock('is-electron', () => () => mockIsElectron())

const mockLogin = jest.fn()
jest.mock('@/api/login', () => ({
  login: async () => mockLogin()
}))

const mockUser = jest.fn()
const mockLoadingUser = jest.fn()
jest.mock('@/api/user', () => ({
  useUser: () => [mockUser(), { loadingUser: mockLoadingUser() }]
}))

jest.mock('@/components/assets/side', () => (props: any) => (
  <div>
    {props.left}
    {props.right}
  </div>
))
jest.mock('@/components/footer', () => () => <div />)

describe('components/indexpage', () => {
  beforeEach(() => {
    mockPush.mockReset()

    mockIsElectron.mockReset()
    mockIsElectron.mockImplementation(() => false)

    mockUser.mockReset()
    mockUser.mockImplementation(() => ({}))
    mockLoadingUser.mockReset()
    mockLoadingUser.mockImplementation(() => false)
  })

  test('render', () => {
    const { unmount } = render(<Index />)

    unmount()
  })

  test('buttons', () => {
    const { unmount } = render(<Index />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => fireEvent.click(button))

    expect(mockPush).toHaveBeenCalledTimes(3)

    unmount()
  })

  test('no user', () => {
    mockUser.mockImplementation(() => undefined)
    const { unmount } = render(<Index />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => fireEvent.click(button))

    expect(mockPush).toHaveBeenCalledTimes(5)

    unmount()
  })

  test('electron', async () => {
    mockIsElectron.mockImplementation(() => true)
    const { unmount } = render(<Index />)

    await waitFor(() => expect(mockPush).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockPush).toHaveBeenLastCalledWith('/dashboard'))

    unmount()
  })

  test('server mode', () => {
    mockUser.mockImplementation(() => undefined)
    process.env.NEXT_PUBLIC_SERVER_MODE = 'frontpage'
    const { unmount } = render(<Index />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => fireEvent.click(button))

    unmount()
  })
})
