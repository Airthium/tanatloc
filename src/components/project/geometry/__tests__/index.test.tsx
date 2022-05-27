import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { IFrontGeometriesItem } from '@/api/index.d'

import Geometry, { errors } from '..'

const mockDeleteButton = jest.fn()
const mockDownloadButton = jest.fn()
const mockEditButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  DeleteButton: (props: any) => mockDeleteButton(props),
  DownloadButton: (props: any) => mockDownloadButton(props),
  EditButton: (props: any) => mockEditButton(props)
}))

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

jest.mock('@/components/assets/mathjax', () => ({
  Inline: () => <div />,
  Formula: () => <div />,
  Html: () => <div />
}))

const mockDel = jest.fn()
const mockDownload = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@/api/geometry', () => ({
  del: async () => mockDel(),
  download: async () => mockDownload(),
  update: async () => mockUpdate()
}))

jest.mock('../add', () => () => <div />)
const mockEdit = jest.fn()
jest.mock('../edit', () => (props: any) => mockEdit(props))

describe('components/project/geometry', () => {
  const project = {
    id: 'id',
    geometries: []
  }
  const geometry = {
    id: 'id',
    name: 'name'
  } as Pick<IFrontGeometriesItem, 'id' | 'name'>
  const swr = {
    mutateProject: jest.fn(),
    mutateOneGeometry: jest.fn(),
    delOneGeometry: jest.fn()
  }
  const close = jest.fn()
  const onCleanup = jest.fn()

  beforeEach(() => {
    mockDeleteButton.mockReset()
    mockDeleteButton.mockImplementation(() => <div />)

    mockDownloadButton.mockReset()
    mockDownloadButton.mockImplementation(() => <div />)

    mockEditButton.mockReset()
    mockEditButton.mockImplementation(() => <div />)

    mockErrorNotification.mockReset()

    mockDel.mockReset()
    mockDownload.mockReset()
    mockUpdate.mockReset()

    mockEdit.mockReset()
    mockEdit.mockImplementation(() => <div />)
  })

  test('render', () => {
    const { unmount } = render(
      <Geometry
        project={project}
        geometry={geometry}
        swr={swr}
        close={close}
        onCleanup={onCleanup}
      />
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
        onCleanup={onCleanup}
      />
    )

    unmount()
  })

  test('download', async () => {
    window.URL.createObjectURL = jest.fn()
    mockDownloadButton.mockImplementation((props) => (
      <div role="DownloadButton" onClick={props.onDownload} />
    ))
    mockDownload.mockImplementation(() => ({ buffer: 'buffer' }))
    const { unmount } = render(
      <Geometry
        project={project}
        geometry={geometry}
        swr={swr}
        close={close}
        onCleanup={onCleanup}
      />
    )

    const button = screen.getByRole('DownloadButton')

    // Normal
    fireEvent.click(button)
    await waitFor(() => expect(mockDownload).toHaveBeenCalledTimes(1))

    // Error
    mockDownload.mockImplementation(() => {
      throw new Error('download error')
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockDownload).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.download,
        new Error('download error')
      )
    )

    unmount()
  })

  test('onEdit', async () => {
    mockEditButton.mockImplementation((props) => (
      <div role="EditButton" onClick={props.onEdit} />
    ))
    mockEdit.mockImplementation((props) => (
      <div
        role="Edit"
        onClick={async () => {
          try {
            await props.onEdit({ name: 'name' })
          } catch (err) {}
        }}
      />
    ))
    const { unmount } = render(
      <Geometry
        project={project}
        geometry={geometry}
        swr={swr}
        close={close}
        onCleanup={onCleanup}
      />
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
      throw new Error('update error')
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.update,
        new Error('update error')
      )
    )

    unmount()
  })

  test('onDelete', async () => {
    mockDeleteButton.mockImplementation((props) => (
      <div
        role="DeleteButton"
        onClick={async () => {
          try {
            await props.onDelete()
          } catch (err) {}
        }}
      />
    ))
    const { unmount } = render(
      <Geometry
        project={{ id: 'id', geometries: ['id'] }}
        geometry={geometry}
        swr={swr}
        close={close}
        onCleanup={onCleanup}
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
      throw new Error('del error')
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockDel).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.del,
        new Error('del error')
      )
    )

    unmount()
  })
})
