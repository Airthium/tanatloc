import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Copy, { errors } from '..'

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockCopy = jest.fn()
jest.mock('@/api/project', () => ({
  copy: async () => mockCopy()
}))

describe('components/project/copy', () => {
  const workspace = { id: 'id', projects: [] }
  const project = { id: 'id' }
  const swr = {
    addOneProject: jest.fn(),
    mutateOneWorkspace: jest.fn()
  }

  beforeEach(() => {
    mockErrorNotification.mockReset()

    mockCopy.mockReset()
    mockCopy.mockImplementation(() => ({}))

    swr.addOneProject.mockReset()
    swr.mutateOneWorkspace.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Copy workspace={workspace} project={project} swr={swr} />
    )

    unmount()
  })

  test('copy', async () => {
    const { unmount } = render(
      <Copy workspace={workspace} project={project} swr={swr} />
    )

    const button = screen.getByRole('button')

    // Normal
    fireEvent.click(button)
    await waitFor(() => expect(swr.addOneProject).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.mutateOneWorkspace).toHaveBeenCalledTimes(1))

    // Error
    mockCopy.mockImplementation(() => {
      throw new Error('copy error')
    })
    fireEvent.click(button)
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.copy,
        new Error('copy error')
      )
    )

    unmount()
  })
})
