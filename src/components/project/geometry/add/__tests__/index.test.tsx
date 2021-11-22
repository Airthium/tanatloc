import React from 'react'
import { fireEvent, screen, render, waitFor } from '@testing-library/react'

import Add from '..'

const mockUpload = jest.fn()
jest.mock('antd/lib/upload', () => (props) => mockUpload(props))

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props) => mockDialog(props))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockAdd = jest.fn()
jest.mock('@/api/geometry', () => ({
  add: async () => mockAdd()
}))

Object.defineProperty(global, 'FileReader', {
  value: class {
    addEventListener(_, callback) {
      callback()
    }
    readAsBufferArray() {
      // mock method
    }
    result = 'buffer'
  }
})

describe('components/project/geometry/add', () => {
  const visible = true
  const project = { id: 'id', geometries: [] }
  const swr = { mutateProject: jest.fn(), addOneGeometry: jest.fn() }
  const setVisible = jest.fn()

  beforeEach(() => {
    mockUpload.mockReset()
    mockUpload.mockImplementation(() => <div />)

    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    mockError.mockReset()

    mockAdd.mockReset()
    mockAdd.mockImplementation(() => ({}))

    swr.mutateProject.mockReset()
    swr.addOneGeometry.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Add
        visible={visible}
        project={project}
        swr={swr}
        setVisible={setVisible}
      />
    )

    unmount()
  })

  test('cancel', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(
      <Add
        visible={visible}
        project={project}
        swr={swr}
        setVisible={setVisible}
      />
    )

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('beforeUpload', () => {
    let file
    mockDialog.mockImplementation((props) => <div>{props.children}</div>)
    mockUpload.mockImplementation((props) => (
      <input
        role="Upload"
        //@ts-ignore
        onClick={(e) => props.beforeUpload(e.target.files[0])}
      />
    ))

    const { unmount } = render(
      <Add
        visible={visible}
        project={project}
        swr={swr}
        setVisible={setVisible}
      />
    )

    const upload = screen.getByRole('Upload')

    // Wrong format
    file = new File(['buffer'], 'file.png', { type: 'application/mesh' })
    fireEvent.click(upload, { target: { files: [file] } })

    // Good format
    file = new File(['buffer'], 'file.dxf', { type: 'image/png' })
    fireEvent.click(upload, { target: { files: [file] } })

    unmount()
  })

  test('onUpload', async () => {
    let info
    mockDialog.mockImplementation((props) => <div>{props.children}</div>)
    mockUpload.mockImplementation((props) => (
      <input
        role="Upload"
        //@ts-ignore
        onClick={(e) => props.onChange(JSON.parse(e.target.value))}
      />
    ))

    const { unmount } = render(
      <Add
        visible={visible}
        project={project}
        swr={swr}
        setVisible={setVisible}
      />
    )

    const upload = screen.getByRole('Upload')

    // Uploading
    info = { file: { status: 'uploading' } }
    fireEvent.click(upload, { target: { value: JSON.stringify(info) } })

    // Done
    info = { file: { status: 'done', originFileObj: {} } }
    fireEvent.click(upload, { target: { value: JSON.stringify(info) } })
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.addOneGeometry).toHaveBeenCalledTimes(1))

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error('add error')
    })
    fireEvent.click(upload, { target: { value: JSON.stringify(info) } })
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('onUpload, undefined project.geometries', async () => {
    let info
    mockDialog.mockImplementation((props) => <div>{props.children}</div>)
    mockUpload.mockImplementation((props) => (
      <input
        role="Upload"
        //@ts-ignore
        onClick={(e) => props.onChange(JSON.parse(e.target.value))}
      />
    ))

    const { unmount } = render(
      <Add
        visible={visible}
        project={{ id: 'id' }}
        swr={swr}
        setVisible={setVisible}
      />
    )

    const upload = screen.getByRole('Upload')

    // Done
    info = { file: { status: 'done', originFileObj: {} } }
    fireEvent.click(upload, { target: { value: JSON.stringify(info) } })
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.addOneGeometry).toHaveBeenCalledTimes(1))

    unmount()
  })
})
