import React from 'react'
import { fireEvent, screen, render, waitFor } from '@testing-library/react'

import Add from '..'

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

describe('components/project/geometry/add', () => {
  const visible = true
  const project = { id: 'id', geometries: [] }
  const swr = { mutateProject: jest.fn(), addOneGeometry: jest.fn() }
  const setVisible = jest.fn()

  beforeEach(() => {
    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    mockError.mockReset()

    mockAdd.mockReset()
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

  test('upload', async () => {
    mockDialog.mockImplementation((props) => <div>{props.children}</div>)
    const { unmount } = render(
      <Add
        visible={visible}
        project={project}
        swr={swr}
        setVisible={setVisible}
      />
    )

    const upload = screen.getByRole('img', { name: 'upload' })

    // Uploading
    mockAdd.mockImplementation(() => ({}))
    const file = new File(['buffer'], 'file.dxf')
    fireEvent.drop(upload, {
      dataTransfer: {
        files: [file]
      }
    })
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.addOneGeometry).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.mutateProject).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('upload', async () => {
    mockDialog.mockImplementation((props) => <div>{props.children}</div>)
    const { unmount } = render(
      <Add
        visible={visible}
        project={project}
        swr={swr}
        setVisible={setVisible}
      />
    )

    const upload = screen.getByRole('img', { name: 'upload' })

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error()
    })
    const file = new File(['buffer'], 'file.dxf')
    fireEvent.drop(upload, {
      dataTransfer: {
        files: [file]
      }
    })
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })
})
