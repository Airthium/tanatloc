import React from 'react'
import { fireEvent, screen, render, waitFor } from '@testing-library/react'

import Add, { errors } from '..'

const mockUpload = jest.fn()
jest.mock('antd/lib/upload', () => (props: any) => mockUpload(props))

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props: any) => mockDialog(props))

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockAdd = jest.fn()
jest.mock('@/api/geometry', () => ({
  add: async () => mockAdd()
}))

Object.defineProperty(global, 'FileReader', {
  value: class {
    addEventListener(_: any, callback: Function) {
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

    mockErrorNotification.mockReset()

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
      <>
        <input
          role="Upload"
          //@ts-ignore
          onClick={(e) => props.onChange(JSON.parse(e.target.value))}
        />
        {props.children}
      </>
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

    await waitFor(() => screen.getByRole('img', { name: 'loading' }))

    info = { file: { status: 'other' } }
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
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.add,
        new Error('add error')
      )
    )

    unmount()
  })
})
