import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import Archive, { errors } from '..'

const mockUpload = jest.fn()
jest.mock('antd/lib/upload', () => (props: any) => mockUpload(props))

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props: any) => mockDialog(props))

const mockDeleteButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  DeleteButton: (props: any) => mockDeleteButton(props)
}))

const mockErrorNotification = jest.fn()
jest.mock('@/context/notification/actions', () => ({
  addError: ({ title, err }: { title: string; err: Error }) =>
    mockErrorNotification(title, err)
}))

const mockProjectArchive = jest.fn()
const mockProjectUnarchiveFromServer = jest.fn()
const mockProjectDeleteArchiveFile = jest.fn()
const mockProjectUnarchiveFromFile = jest.fn()
jest.mock('@/api/project', () => ({
  archive: async () => mockProjectArchive(),
  unarchiveFromServer: async () => mockProjectUnarchiveFromServer(),
  deleteArchiveFile: async () => mockProjectDeleteArchiveFile(),
  unarchiveFromFile: async () => mockProjectUnarchiveFromFile()
}))

Object.defineProperty(global, 'FileReader', {
  value: class {
    addEventListener(_: any, callback: Function) {
      callback()
    }
    readAsBufferArray() {
      // mock method
    }
    result = 'archive'
  }
})

describe('components/project/archive', () => {
  const workspace = {
    id: 'id'
  }
  const project = {
    id: 'id',
    archived: false,
    title: 'Title'
  }
  const swr = {
    mutateOneWorkspace: jest.fn(),
    mutateOneProject: jest.fn()
  }

  beforeEach(() => {
    mockUpload.mockReset()
    mockUpload.mockImplementation(() => <div />)

    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    mockDeleteButton.mockReset()
    mockDeleteButton.mockImplementation(() => <div />)

    mockErrorNotification.mockReset()

    mockProjectArchive.mockReset()
    mockProjectUnarchiveFromServer.mockReset()
    mockProjectDeleteArchiveFile.mockReset()
    mockProjectUnarchiveFromFile.mockReset()

    swr.mutateOneWorkspace.mockReset()
    swr.mutateOneProject.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Archive workspace={workspace} project={project} swr={swr} />
    )

    unmount()
  })

  test('onCancel', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))

    const { unmount } = render(
      <Archive workspace={workspace} project={project} swr={swr} />
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('onArchive', async () => {
    Object.defineProperty(window.URL, 'createObjectURL', { value: () => 'url' })
    mockProjectArchive.mockImplementation(() => ({
      blob: async () => 'blob'
    }))
    mockDialog.mockImplementation((props) => (
      <div
        role="Dialog"
        onClick={async () => {
          try {
            await props.onOk()
          } catch (err) {}
        }}
      />
    ))

    const { unmount } = render(
      <Archive workspace={workspace} project={project} swr={swr} />
    )

    const dialog = screen.getByRole('Dialog')

    // Normal
    await act(() => fireEvent.click(dialog))
    await waitFor(() => expect(mockProjectArchive).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.mutateOneProject).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.mutateOneWorkspace).toHaveBeenCalledTimes(1))

    // Error
    mockProjectArchive.mockImplementation(() => {
      throw new Error('archive error')
    })
    await act(() => fireEvent.click(dialog))
    await waitFor(() => expect(mockProjectArchive).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.archive,
        new Error('archive error')
      )
    )

    unmount()
  })

  test('unarchiveFromServer', async () => {
    mockDialog.mockImplementation((props) => <div>{props.children}</div>)
    const { unmount } = render(
      <Archive
        workspace={workspace}
        project={{ ...project, archived: true }}
        swr={swr}
      />
    )

    const button = screen.getByRole('button', {
      name: 'Restore archive from the server'
    })

    // Normal
    await act(() => fireEvent.click(button))
    await waitFor(() =>
      expect(mockProjectUnarchiveFromServer).toHaveBeenCalledTimes(1)
    )
    await waitFor(() => expect(swr.mutateOneProject).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.mutateOneWorkspace).toHaveBeenCalledTimes(1))

    // Error
    mockProjectUnarchiveFromServer.mockImplementation(() => {
      throw new Error('unarchiveFromServer error')
    })
    await act(() => fireEvent.click(button))
    await waitFor(() =>
      expect(mockProjectUnarchiveFromServer).toHaveBeenCalledTimes(2)
    )
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.unarchiveServer,
        new Error('unarchiveFromServer error')
      )
    )

    unmount()
  })

  test('deleteArchive', async () => {
    mockDialog.mockImplementation((props) => <div>{props.children}</div>)
    mockDeleteButton.mockImplementation((props) => (
      <div role="DeleteButton" onClick={props.onDelete} />
    ))
    const { unmount } = render(
      <Archive
        workspace={workspace}
        project={{ ...project, archived: true }}
        swr={swr}
      />
    )

    const button = screen.getByRole('DeleteButton')

    // Normal
    await act(() => fireEvent.click(button))
    await waitFor(() =>
      expect(mockProjectDeleteArchiveFile).toHaveBeenCalledTimes(1)
    )

    // Error
    mockProjectDeleteArchiveFile.mockImplementation(() => {
      throw new Error('deleteArchiveFile error')
    })
    await act(() => fireEvent.click(button))
    await waitFor(() =>
      expect(mockProjectDeleteArchiveFile).toHaveBeenCalledTimes(2)
    )
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.deleteArchive,
        new Error('deleteArchiveFile error')
      )
    )

    unmount()
  })

  test('uanrchiveFromFile', async () => {
    let info: any
    mockDialog.mockImplementation((props) => <div>{props.children}</div>)
    mockUpload.mockImplementation((props) => (
      <input
        role="Upload"
        //@ts-ignore
        onClick={(e) => props.onChange(JSON.parse(e.target.value))}
      />
    ))
    const { unmount } = render(
      <Archive
        workspace={workspace}
        project={{ ...project, archived: true }}
        swr={swr}
      />
    )

    const upload = screen.getByRole('Upload')

    // Uploading
    info = { file: { status: 'uploading' } }
    await act(() =>
      fireEvent.click(upload, { target: { value: JSON.stringify(info) } })
    )

    // Other
    info = { file: { status: 'other' } }
    await act(() =>
      fireEvent.click(upload, { target: { value: JSON.stringify(info) } })
    )

    // Done
    info = {
      file: { status: 'done', name: 'name', uid: 'uid', originFileObj: {} }
    }
    await act(() =>
      fireEvent.click(upload, { target: { value: JSON.stringify(info) } })
    )
    await waitFor(() =>
      expect(mockProjectUnarchiveFromFile).toHaveBeenCalledTimes(1)
    )
    await waitFor(() => expect(swr.mutateOneProject).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.mutateOneWorkspace).toHaveBeenCalledTimes(1))

    // Error
    mockProjectUnarchiveFromFile.mockImplementation(() => {
      throw new Error('unarchiveFromFile error')
    })
    await act(() =>
      fireEvent.click(upload, { target: { value: JSON.stringify(info) } })
    )
    await waitFor(() =>
      expect(mockProjectUnarchiveFromFile).toHaveBeenCalledTimes(2)
    )
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.upload,
        new Error('unarchiveFromFile error')
      )
    )

    unmount()
  })
})
