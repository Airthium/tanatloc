import { EditorContext } from '@/context/editor'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import Load, { errors } from '..'

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props: any) => mockDialog(props))

const mockDelete = jest.fn()
jest.mock('../../delete', () => (props: any) => mockDelete(props))

const contextValue = {
  template: 'template',
  model: 'model',
  templateValid: true,
  modelValid: true,
  dispatch: () => {
    throw new Error('dispatch error')
  }
}

describe('components/editor/load', () => {
  const user = { id: 'id', models: [], templates: [] }
  const swr = { mutateUser: jest.fn() }

  beforeEach(() => {
    mockErrorNotification.mockReset()

    mockDelete.mockReset()
    mockDelete.mockImplementation(() => <div />)

    swr.mutateUser.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Load user={user} swr={swr} />)

    unmount()
  })

  test('button', () => {
    const { unmount } = render(<Load user={user} swr={swr} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    unmount()
  })

  test('cancel', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(<Load user={user} swr={swr} />)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('Tanatloc load', async () => {
    mockDialog.mockImplementation((props) => <div>{props.children}</div>)
    const { unmount } = render(<Load user={user} swr={swr} />)

    const button = screen.getAllByRole('button', { name: 'file-text' })[0]

    // Fetch ok
    //@ts-ignore
    global.fetch = () => ({
      text: () => 'text'
    })
    await act(() => fireEvent.click(button))

    // Fetch error
    //@ts-ignore
    global.fetch = () => ({
      text: () => {
        throw new Error('fetch error')
      }
    })
    await act(() => fireEvent.click(button))

    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.load,
        new Error('fetch error')
      )
    )

    unmount()
  })

  test('personal load', () => {
    user.models = [{ name: 'personal model', user: 'id' } as never]
    mockDialog.mockImplementation((props) => <div>{props.children}</div>)
    const { unmount } = render(<Load user={user} swr={swr} />)

    // Switch tab
    const tab = screen.getByRole('tab', { name: 'My models' })
    fireEvent.click(tab)

    const button = screen.getAllByRole('button', { name: 'file-text' })[0]
    fireEvent.click(button)

    unmount()
  })

  test('personal load, dispatch error', async () => {
    user.models = [{ name: 'personal model' } as never]
    mockDialog.mockImplementation((props) => <div>{props.children}</div>)
    const { unmount } = render(
      <EditorContext.Provider value={contextValue}>
        <Load user={user} swr={swr} />
      </EditorContext.Provider>
    )

    // Switch tab
    const tab = screen.getByRole('tab', { name: 'My models' })
    await act(() => fireEvent.click(tab))

    const button = screen.getAllByRole('button', { name: 'file-text' })[0]
    await act(() => fireEvent.click(button))

    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.load,
        new Error('dispatch error')
      )
    )

    unmount()
  })
})
