import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Load, { errors } from '..'

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockSimulationSelector = jest.fn()
jest.mock('@/components/project/simulation', () => ({
  Selector: (props: any) => mockSimulationSelector(props)
}))

const mockUpdate = jest.fn()
jest.mock('@/api/user', () => ({
  update: async () => mockUpdate()
}))

describe('components/editor/browser', () => {
  const user = { id: 'id', usermodels: [] }
  const swr = { mutateUser: jest.fn() }

  beforeEach(() => {
    mockErrorNotification.mockReset()

    mockSimulationSelector.mockReset()
    mockSimulationSelector.mockImplementation(() => <div />)

    mockUpdate.mockReset()

    swr.mutateUser.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Load user={user} swr={swr} />)

    unmount()
  })

  test('visible', () => {
    const { unmount } = render(<Load user={user} swr={swr} />)

    const open = screen.getByRole('button')
    fireEvent.click(open)

    unmount()
  })

  test('onCancel', () => {
    mockSimulationSelector.mockImplementation((props: any) => (
      <div role="Selector" onClick={props.onCancel} />
    ))
    const { unmount } = render(<Load user={user} swr={swr} />)

    const selector = screen.getByRole('Selector')
    fireEvent.click(selector)

    unmount()
  })

  test('onDelete', async () => {
    mockSimulationSelector.mockImplementation((props: any) => (
      <div role="Selector" onClick={() => props.onDelete(1)} />
    ))
    const { unmount } = render(<Load user={user} swr={swr} />)

    const selector = screen.getByRole('Selector')
    fireEvent.click(selector)

    // Normal
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.mutateUser).toHaveBeenCalledTimes(1))

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    fireEvent.click(selector)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    expect(mockErrorNotification).toHaveBeenLastCalledWith(
      errors.delete,
      new Error('update error')
    )

    unmount()
  })

  test('onOk', async () => {
    mockSimulationSelector.mockImplementation((props: any) => (
      <div
        role="Selector"
        onClick={() => props.onOk({ user: 'id', algorithm: 'algorithm' })}
      />
    ))
    const { unmount } = render(<Load user={user} swr={swr} />)

    const selector = screen.getByRole('Selector')

    // Fetch ok
    //@ts-ignore
    global.fetch = () => ({
      text: () => 'text'
    })
    fireEvent.click(selector)

    // Fetch error
    //@ts-ignore
    global.fetch = () => ({
      text: () => {
        throw new Error('fetch error')
      }
    })
    fireEvent.click(selector)
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    expect(mockErrorNotification).toHaveBeenLastCalledWith(
      errors.load,
      new Error('fetch error')
    )

    unmount()
  })
})
