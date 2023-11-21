import { fireEvent, screen, render, waitFor } from '@testing-library/react'
import Split, { errors } from '..'

const mockErrorNotification = jest.fn()
jest.mock('@/context/notification/actions', () => ({
  addError: ({ title, err }: { title: string; err: Error }) =>
    mockErrorNotification(title, err)
}))

const mockSplit = jest.fn()
jest.mock('@/api/geometry', () => ({
  splitStep: async () => mockSplit()
}))

describe('components/project/geoemtry/split', () => {
  const project = {
    id: 'id'
  }
  const geometry = {
    id: 'id',
    summary: {
      uuid: 'uuid',
      type: 'geometry3D',
      dimension: 3
    }
  }

  beforeEach(() => {
    mockSplit.mockReset()
    mockSplit.mockImplementation(() => ({ message: 'message' }))
  })

  test('render', () => {
    const { unmount } = render(<Split project={project} geometry={geometry} />)

    unmount()
  })

  test('split', async () => {
    const { unmount } = render(<Split project={project} geometry={geometry} />)

    const button = screen.getByRole('button')

    fireEvent.click(button)
    await waitFor(() => expect(mockSplit).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('split error', async () => {
    mockSplit.mockImplementation(() => {
      throw new Error()
    })
    const { unmount } = render(<Split project={project} geometry={geometry} />)

    const button = screen.getByRole('button')

    fireEvent.click(button)
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    expect(mockErrorNotification).toHaveBeenLastCalledWith(
      errors.split,
      new Error()
    )

    unmount()
  })
})
