import { EditorContext } from '@/context/editor'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import Save, { errors } from '..'

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockUserUpdate = jest.fn()
jest.mock('@/api/user', () => ({
  update: (content: any) => mockUserUpdate(content)
}))

const mockDeepCopy = jest.fn()
jest.mock('@/lib/utils', () => ({
  deepCopy: (obj: any) => mockDeepCopy(obj)
}))

describe('components/editor/save', () => {
  const user = { id: 'id', models: [] }
  const swr = {
    mutateUser: jest.fn()
  }

  beforeEach(() => {
    mockErrorNotification.mockReset()

    mockUserUpdate.mockReset()

    mockDeepCopy.mockReset()

    swr.mutateUser.mockReset()

    user.models = []
  })

  test('render', () => {
    const { unmount } = render(<Save user={user} swr={swr} />)

    unmount()
  })

  test('enabled, wrong JSON', async () => {
    const { unmount } = render(
      <EditorContext.Provider
        value={{
          template: 'template',
          model: '',
          dispatch: jest.fn(),
          templateValid: true,
          modelValid: true
        }}
      >
        <Save user={user} swr={swr} />
      </EditorContext.Provider>
    )

    const button = screen.getByRole('button', { name: 'save' })
    fireEvent.click(button)

    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.json,
        new SyntaxError('Unexpected end of JSON input')
      )
    )

    unmount()
  })

  test('no model', async () => {
    mockDeepCopy.mockImplementation((obj) => JSON.parse(JSON.stringify(obj)))
    //@ts-ignore
    user.models = undefined
    const { unmount } = render(
      <EditorContext.Provider
        value={{
          template: 'template',
          model: '{"algorithm": "algorithm"}',
          dispatch: jest.fn(),
          templateValid: true,
          modelValid: true
        }}
      >
        <Save user={user} swr={swr} />
      </EditorContext.Provider>
    )

    const button = screen.getByRole('button', { name: 'save' })
    fireEvent.click(button)

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
      <EditorContext.Provider
        value={{
          template: 'template',
          model: '{}',
          dispatch: jest.fn(),
          templateValid: true,
          modelValid: true
        }}
      >
        <Save user={user} swr={swr} />
      </EditorContext.Provider>
    )

    const button = screen.getByRole('button', { name: 'save' })
    fireEvent.click(button)

    await waitFor(() => expect(mockUserUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockUserUpdate).toHaveBeenLastCalledWith([
        {
          key: 'models',
          method: 'append',
          type: 'array',
          value: { user: 'id' }
        },
        { key: 'templates', method: 'append', type: 'array', value: 'template' }
      ])
    )

    unmount()
  })

  test('add new error', async () => {
    mockDeepCopy.mockImplementation((obj) => JSON.parse(JSON.stringify(obj)))
    mockUserUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    const { unmount } = render(
      <EditorContext.Provider
        value={{
          template: 'template',
          model: '{}',
          dispatch: jest.fn(),
          templateValid: true,
          modelValid: true
        }}
      >
        <Save user={user} swr={swr} />
      </EditorContext.Provider>
    )

    const button = screen.getByRole('button', { name: 'save' })
    fireEvent.click(button)

    await act(async () =>
      waitFor(() => expect(mockUserUpdate).toHaveBeenCalledTimes(1))
    )
    await waitFor(() =>
      expect(mockUserUpdate).toHaveBeenLastCalledWith([
        {
          key: 'models',
          method: 'append',
          type: 'array',
          value: { user: 'id' }
        },
        { key: 'templates', method: 'append', type: 'array', value: 'template' }
      ])
    )
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
    user.models = [{ algorithm: 'algorithm' } as never]
    const { unmount } = render(
      <EditorContext.Provider
        value={{
          template: 'template',
          model: '{"algorithm": "algorithm"}',
          dispatch: jest.fn(),
          templateValid: true,
          modelValid: true
        }}
      >
        <Save user={user} swr={swr} />
      </EditorContext.Provider>
    )

    const button = screen.getByRole('button', { name: 'save' })
    fireEvent.click(button)

    await waitFor(() => screen.getByRole('button', { name: 'OK' }))

    const ok = screen.getByRole('button', { name: 'OK' })
    fireEvent.click(ok)
    const cancel = screen.getByRole('button', { name: 'Cancel' })

    await waitFor(() => expect(mockUserUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockUserUpdate).toHaveBeenLastCalledWith([
        {
          key: 'models',
          method: 'set',
          index: 0,
          type: 'array',
          value: { algorithm: 'algorithm', user: 'id' }
        },
        {
          key: 'templates',
          method: 'set',
          index: 0,
          type: 'array',
          value: 'template'
        }
      ])
    )

    fireEvent.click(cancel)

    unmount()
  })

  test('replace error', async () => {
    mockDeepCopy.mockImplementation((obj) => JSON.parse(JSON.stringify(obj)))
    mockUserUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    user.models = [{ algorithm: 'algorithm' } as never]
    const { unmount } = render(
      <EditorContext.Provider
        value={{
          template: 'template',
          model: '{"algorithm": "algorithm"}',
          dispatch: jest.fn(),
          templateValid: true,
          modelValid: true
        }}
      >
        <Save user={user} swr={swr} />
      </EditorContext.Provider>
    )

    const button = screen.getByRole('button', { name: 'save' })
    fireEvent.click(button)

    await waitFor(() => screen.getByRole('button', { name: 'OK' }))

    const ok = screen.getByRole('button', { name: 'OK' })
    fireEvent.click(ok)
    const cancel = screen.getByRole('button', { name: 'Cancel' })

    await act(async () =>
      waitFor(() => expect(mockUserUpdate).toHaveBeenCalledTimes(1))
    )
    await waitFor(() =>
      expect(mockUserUpdate).toHaveBeenLastCalledWith([
        {
          key: 'models',
          method: 'set',
          index: 0,
          type: 'array',
          value: { algorithm: 'algorithm', user: 'id' }
        },
        {
          key: 'templates',
          method: 'set',
          index: 0,
          type: 'array',
          value: 'template'
        }
      ])
    )
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.save,
        new Error('update error')
      )
    )

    fireEvent.click(cancel)

    unmount()
  })
})
