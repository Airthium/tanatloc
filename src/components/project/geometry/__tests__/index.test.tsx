import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Geometry from '..'

jest.mock('@/lib/mathjax', () => ({
  mathjaxRefresh: jest.fn
}))

const mockDeleteButton = (props) => (
  <div role="DeleteButton" onClick={props.onDelete} />
)
const mockDownloadButton = (props) => (
  <div role="DownloadButton" onClick={props.onDownload} />
)
const mockEditButton = (props) => (
  <div role="EditButton" onClick={props.onEdit} />
)
jest.mock('@/components/assets/button', () => ({
  DeleteButton: (props) => mockDeleteButton(props),
  DownloadButton: (props) => mockDownloadButton(props),
  EditButton: (props) => mockEditButton(props)
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('../add', () => () => <div />)

const mockEdit = (props) => (
  <div
    role="Edit"
    onClick={async () => {
      try {
        await props.onEdit({ name: 'name' })
      } catch (err) {}
    }}
  />
)
jest.mock('../edit', () => (props) => mockEdit(props))

const mockDel = jest.fn()
const mockDownload = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@/api/geometry', () => ({
  del: async () => mockDel(),
  download: async () => mockDownload(),
  update: async () => mockUpdate()
}))

describe('components/project/geometry', () => {
  const project = {
    id: 'id',
    geometries: []
  }
  const geometry = {
    id: 'id',
    name: 'name'
  }
  const swr = {
    mutateProject: jest.fn(),
    mutateOneGeometry: jest.fn(),
    delOneGeometry: jest.fn()
  }
  const close = jest.fn()

  beforeEach(() => {
    mockError.mockReset()

    mockDel.mockReset()
    mockDownload.mockReset()
    mockUpdate.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Geometry project={project} geometry={geometry} swr={swr} close={close} />
    )

    unmount()
  })

  test('loading', () => {
    const { unmount } = render(
      <Geometry
        project={project}
        geometry={undefined}
        swr={swr}
        close={close}
      />
    )

    unmount()
  })

  test('with summary', () => {
    const { unmount } = render(
      <Geometry
        project={project}
        geometry={{
          ...geometry,
          summary: { solids: [], faces: [], edges: [] }
        }}
        swr={swr}
        close={close}
      />
    )

    unmount()
  })

  test('download', async () => {
    window.URL.createObjectURL = jest.fn()
    mockDownload.mockImplementation(() => ({ buffer: 'buffer' }))
    const { unmount } = render(
      <Geometry project={project} geometry={geometry} swr={swr} close={close} />
    )

    const button = screen.getByRole('DownloadButton')

    // Normal
    fireEvent.click(button)
    await waitFor(() => expect(mockDownload).toHaveBeenCalledTimes(1))

    // Error
    mockDownload.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockDownload).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('onEdit', async () => {
    const { unmount } = render(
      <Geometry project={project} geometry={geometry} swr={swr} close={close} />
    )

    // Visible
    const visible = screen.getByRole('EditButton')
    fireEvent.click(visible)

    const button = screen.getByRole('Edit')

    // Normal
    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.mutateOneGeometry).toHaveBeenCalledTimes(1))

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('onDelete', async () => {
    const { unmount } = render(
      <Geometry
        project={{ id: 'id', geometries: ['id'] }}
        geometry={geometry}
        swr={swr}
        close={close}
      />
    )

    const button = screen.getByRole('DeleteButton')

    // Normal
    fireEvent.click(button)
    await waitFor(() => expect(mockDel).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.mutateProject).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.delOneGeometry).toHaveBeenCalledTimes(1))

    // Error
    mockDel.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockDel).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })
})
