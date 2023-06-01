import { fireEvent, render, screen } from '@testing-library/react'

import Editor from '..'

const mockReplace = jest.fn()
const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    replace: (route: any) => mockReplace(route),
    push: async (route: any) => mockPush(route)
  })
}))

const mockDeleteButton = jest.fn()
const mockGoBack = jest.fn()
jest.mock('@/components/assets/button', () => ({
  DeleteButton: (props: any) => mockDeleteButton(props),
  GoBack: (props: any) => mockGoBack(props)
}))

jest.mock('@/components/loading', () => () => <div />)

const mockUseUser = jest.fn()
jest.mock('@/api/user', () => ({
  useUser: () => mockUseUser()
}))

jest.mock('../steps', () => () => <div />)
jest.mock('../blobs', () => () => <div />)
jest.mock('../new', () => () => <div />)
jest.mock('../browser', () => () => <div />)
jest.mock('../save', () => () => <div />)
jest.mock('../code', () => () => <div />)
jest.mock('../share', () => () => <div />)
jest.mock('../autoSave', () => () => <div />)
jest.mock('../info', () => () => <div />)

describe('component/editor', () => {
  const loadingUser = jest.fn(() => false)
  const mutateUser = jest.fn()

  beforeEach(() => {
    mockReplace.mockReset()
    mockPush.mockReset()

    mockDeleteButton.mockReset()
    mockDeleteButton.mockImplementation(() => <div />)

    mockGoBack.mockReset()
    mockGoBack.mockImplementation(() => <div />)

    mockUseUser.mockReset()
    mockUseUser.mockImplementation(() => [
      { usermodels: [] },
      { loadingUser: loadingUser(), mutateUser }
    ])
    loadingUser.mockReset()
    mutateUser.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Editor />)

    unmount()
  })

  test('no user', () => {
    mockUseUser.mockImplementation(() => [
      null,
      { loadingUser: false, mutateUser }
    ])
    const { unmount } = render(<Editor />)

    expect(mockReplace).toHaveBeenCalledTimes(1)
    expect(mockReplace).toHaveBeenLastCalledWith('/')

    unmount()
  })

  test('dashboard', () => {
    mockGoBack.mockImplementation((props) => (
      <div role="GoBack" onClick={props.onClick} />
    ))
    const { unmount } = render(<Editor />)

    const goBack = screen.getByRole('GoBack')
    fireEvent.click(goBack)

    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenLastCalledWith({ pathname: '/dashboard' })

    unmount()
  })

  test('tour', () => {
    const { unmount } = render(<Editor />)

    const button = screen.getByRole('button', { name: 'caret-right' })
    fireEvent.click(button)

    let next: HTMLElement | undefined = screen.getByRole('button', {
      name: 'Next'
    })
    fireEvent.click(next)

    while (next) {
      try {
        next = screen.getByRole('button', { name: 'Next' })
        fireEvent.click(next)
      } catch (err) {
        next = undefined
      }
    }

    const close = screen.getByRole('button', { name: 'Finish' })
    fireEvent.click(close)

    unmount()
  })
})
