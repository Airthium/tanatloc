import { EditorContext } from '@/context/editor'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import Save, { errors } from '..'

const mockErrorNotification = jest.fn()
jest.mock('@/context/notification/actions', () => ({
  addError: ({ title, err }: { title: string; err: Error }) =>
    mockErrorNotification(title, err)
}))

const mockUserModelAdd = jest.fn()
const mockUserModelUpdate = jest.fn()
jest.mock('@/api/userModel', () => ({
  add: async (content: any) => mockUserModelAdd(content),
  update: (content: any) => mockUserModelUpdate(content)
}))

const mockDeepCopy = jest.fn()
jest.mock('@/lib/utils', () => ({
  deepCopy: (obj: any) => mockDeepCopy(obj)
}))

const contextValue0 = {
  template: 'template',
  model: '',
  dispatch: jest.fn(),
  templateValid: true,
  modelValid: true
}

const contextValue1 = {
  template: 'template',
  model: '{}',
  dispatch: jest.fn(),
  templateValid: true,
  modelValid: true
}

const contextValue2 = {
  template: 'template',
  model: '{"algorithm": "algorithm"}',
  dispatch: jest.fn(),
  templateValid: true,
  modelValid: true
}

describe('components/editor/save', () => {
  const user = { id: 'id', usermodels: [] }
  const swr = {
    mutateUser: jest.fn()
  }

  beforeEach(() => {
    mockErrorNotification.mockReset()

    mockUserModelAdd.mockReset()
    mockUserModelAdd.mockImplementation(() => ({}))
    mockUserModelUpdate.mockReset()

    mockDeepCopy.mockReset()

    swr.mutateUser.mockReset()

    user.usermodels = []
  })

  test('render', () => {
    const { unmount } = render(<Save user={user} swr={swr} />)

    unmount()
  })

  test('enabled, wrong JSON', async () => {
    const { unmount } = render(
      <EditorContext.Provider value={contextValue0}>
        <Save user={user} swr={swr} />
      </EditorContext.Provider>
    )

    const button = screen.getByRole('button', { name: 'save' })
    await act(() => fireEvent.click(button))

    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.json,
        new SyntaxError('JSON5: invalid end of input at 1:1')
      )
    )

    unmount()
  })

  test('no model', async () => {
    mockDeepCopy.mockImplementation((obj) => JSON.parse(JSON.stringify(obj)))
    //@ts-ignore
    user.usermodels = undefined
    const { unmount } = render(
      <EditorContext.Provider value={contextValue2}>
        <Save user={user} swr={swr} />
      </EditorContext.Provider>
    )

    const button = screen.getByRole('button', { name: 'save' })
    await act(() => fireEvent.click(button))

    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.check,
        new TypeError("Cannot read properties of undefined (reading 'find')")
      )
    )

    unmount()
  })

  test('add new', async () => {
    mockDeepCopy.mockImplementation((obj) => JSON.parse(JSON.stringify(obj)))
    const { unmount } = render(
      <EditorContext.Provider value={contextValue1}>
        <Save user={user} swr={swr} />
      </EditorContext.Provider>
    )

    const button = screen.getByRole('button', { name: 'save' })
    await act(() => fireEvent.click(button))

    await waitFor(() => expect(mockUserModelAdd).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockUserModelAdd).toHaveBeenLastCalledWith({
        model: {},
        template: 'template'
      })
    )

    unmount()
  })

  test('add new error', async () => {
    mockDeepCopy.mockImplementation((obj) => JSON.parse(JSON.stringify(obj)))
    mockUserModelAdd.mockImplementation(() => {
      throw new Error('update error')
    })
    const { unmount } = render(
      <EditorContext.Provider value={contextValue1}>
        <Save user={user} swr={swr} />
      </EditorContext.Provider>
    )

    const button = screen.getByRole('button', { name: 'save' })
    await act(() => fireEvent.click(button))

    await waitFor(() => expect(mockUserModelAdd).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.save,
        new Error('update error')
      )
    )

    unmount()
  })

  test('replace', async () => {
    mockDeepCopy.mockImplementation((obj) => JSON.parse(JSON.stringify(obj)))
    user.usermodels = [
      {
        id: 'id',
        model: { algorithm: 'algorithm' },
        owners: [{ id: 'id' }]
      } as never
    ]
    const { unmount } = render(
      <EditorContext.Provider value={contextValue2}>
        <Save user={user} swr={swr} />
      </EditorContext.Provider>
    )

    const button = screen.getByRole('button', { name: 'save' })
    await act(() => fireEvent.click(button))

    await waitFor(() => screen.getByRole('button', { name: 'OK' }))

    const ok = screen.getByRole('button', { name: 'OK' })
    const cancel = screen.getByRole('button', { name: 'Cancel' })
    await act(() => fireEvent.click(ok))

    await waitFor(() => expect(mockUserModelUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockUserModelUpdate).toHaveBeenLastCalledWith({
        id: 'id'
      })
    )

    await act(() => fireEvent.click(cancel))

    unmount()
  })

  test('add new one', async () => {
    mockDeepCopy.mockImplementation((obj) => JSON.parse(JSON.stringify(obj)))
    user.usermodels = [
      {
        id: 'id',
        model: { algorithm: 'algorithm' },
        owners: [{ id: 'id2' }]
      } as never
    ]
    const { unmount } = render(
      <EditorContext.Provider value={contextValue2}>
        <Save user={user} swr={swr} />
      </EditorContext.Provider>
    )

    const button = screen.getByRole('button', { name: 'save' })
    await act(() => fireEvent.click(button))

    await waitFor(() => screen.getByRole('button', { name: 'OK' }))

    const ok = screen.getByRole('button', { name: 'OK' })
    const cancel = screen.getByRole('button', { name: 'Cancel' })
    await act(() => fireEvent.click(ok))

    await waitFor(() => expect(mockUserModelAdd).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockUserModelAdd).toHaveBeenLastCalledWith({
        model: { algorithm: 'algorithm' },
        template: 'template'
      })
    )

    await act(() => fireEvent.click(cancel))

    unmount()
  })

  test('replace error', async () => {
    mockDeepCopy.mockImplementation((obj) => JSON.parse(JSON.stringify(obj)))
    mockUserModelUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    user.usermodels = [
      { model: { algorithm: 'algorithm' }, owners: [{ id: 'id' }] } as never
    ]
    const { unmount } = render(
      <EditorContext.Provider value={contextValue2}>
        <Save user={user} swr={swr} />
      </EditorContext.Provider>
    )

    const button = screen.getByRole('button', { name: 'save' })
    await act(() => fireEvent.click(button))

    await waitFor(() => screen.getByRole('button', { name: 'OK' }))

    const ok = screen.getByRole('button', { name: 'OK' })
    const cancel = screen.getByRole('button', { name: 'Cancel' })
    await act(() => fireEvent.click(ok))

    await waitFor(() => expect(mockUserModelUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.save,
        new Error('update error')
      )
    )

    await act(() => fireEvent.click(cancel))

    unmount()
  })
})
