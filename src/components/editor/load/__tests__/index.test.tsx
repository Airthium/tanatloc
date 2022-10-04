import { EditorContext } from '@/context/editor'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Load, { errors } from '..'

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props: any) => mockDialog(props))

describe('components/editor/load', () => {
  const user = { id: 'id', models: [], templates: [] }

  beforeEach(() => {
    mockErrorNotification.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Load user={user} />)

    unmount()
  })

  test('button', () => {
    const { unmount } = render(<Load user={user} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    unmount()
  })

  test('cancel', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(<Load user={user} />)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('Tanatloc load', async () => {
    mockDialog.mockImplementation((props) => <div>{props.children}</div>)
    const { unmount } = render(<Load user={user} />)

    const button = screen.getByRole('button', { name: 'Linear elasticity' })

    // Fetch ok
    //@ts-ignore
    global.fetch = () => ({
      text: () => 'text'
    })
    fireEvent.click(button)

    // Fetch error
    //@ts-ignore
    global.fetch = () => ({
      text: () => {
        throw new Error('fetch error')
      }
    })
    fireEvent.click(button)

    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.load,
        new Error('fetch error')
      )
    )

    unmount()
  })

  test('personal load', async () => {
    user.models = [{ name: 'personal model' } as never]
    mockDialog.mockImplementation((props) => <div>{props.children}</div>)
    const { unmount } = render(<Load user={user} />)

    // Switch tab
    const tab = screen.getByRole('tab', { name: 'My models' })
    fireEvent.click(tab)

    const button = screen.getByRole('button', { name: 'personal model' })
    fireEvent.click(button)

    unmount()
  })

  test('personal load, dispatch error', async () => {
    user.models = [{ name: 'personal model' } as never]
    mockDialog.mockImplementation((props) => <div>{props.children}</div>)
    const { unmount } = render(
      <EditorContext.Provider
        value={{
          template: 'template',
          model: 'model',
          templateValid: true,
          modelValid: true,
          dispatch: () => {
            throw new Error('dispatch error')
          }
        }}
      >
        <Load user={user} />
      </EditorContext.Provider>
    )

    // Switch tab
    const tab = screen.getByRole('tab', { name: 'My models' })
    fireEvent.click(tab)

    const button = screen.getByRole('button', { name: 'personal model' })
    fireEvent.click(button)

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
