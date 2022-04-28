import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { IFrontOrganizationsItem } from '@/api/index.d'

import Add, { errors } from '..'

const mockAddButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  AddButton: (props: any) => mockAddButton(props)
}))

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props: any) => mockDialog(props))

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockUpdate = jest.fn()
jest.mock('@/api/organization', () => ({
  update: async () => mockUpdate()
}))

describe('componenets/assets/organization/users/add', () => {
  const title = 'title'
  const organization = {
    id: 'id',
    owners: [],
    pendingowners: [],
    users: [],
    pendingusers: []
  }
  const dBkey = 'users'
  const swr = {
    mutateOneOrganization: jest.fn()
  }

  beforeEach(() => {
    mockAddButton.mockReset()
    mockAddButton.mockImplementation(() => <div />)

    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    mockErrorNotification.mockReset()

    mockUpdate.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Add title={title} organization={organization} dBkey={dBkey} swr={swr} />
    )

    unmount()
  })

  test('setVisible', () => {
    mockAddButton.mockImplementation((props) => (
      <div role="AddButton" onClick={props.onAdd} />
    ))
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(
      <Add title={title} organization={organization} dBkey={dBkey} swr={swr} />
    )
    const button = screen.getByRole('AddButton')
    fireEvent.click(button)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('onFinish', async () => {
    mockDialog.mockImplementation((props) => (
      <div
        role="Dialog"
        onClick={async () => {
          try {
            await props.onOk({ email: 'email' })
          } catch (err) {}
        }}
      />
    ))
    const { unmount } = render(
      <Add title={title} organization={organization} dBkey={dBkey} swr={swr} />
    )

    const dialog = screen.getByRole('Dialog')

    // Normal
    fireEvent.click(dialog)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneOrganization).toHaveBeenCalledTimes(1)
    )

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    fireEvent.click(dialog)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.add,
        new Error('update error')
      )
    )

    unmount()
  })

  test('onFinish, exists', async () => {
    mockDialog.mockImplementation((props) => (
      <div
        role="Dialog"
        onClick={async () => {
          try {
            await props.onOk({ email: 'email' })
          } catch (err) {}
        }}
      />
    ))
    const { unmount } = render(
      <Add
        title={title}
        organization={{
          id: 'id',
          owners: [{ id: 'ido' } as IFrontOrganizationsItem['owners'][0]],
          pendingowners: [
            {
              id: 'idpo',
              email: 'email'
            } as IFrontOrganizationsItem['pendingowners'][0]
          ],
          users: [{ id: 'idu' } as IFrontOrganizationsItem['users'][0]],
          pendingusers: [
            { id: 'idpu' } as IFrontOrganizationsItem['pendingusers'][0]
          ]
        }}
        dBkey={dBkey}
        swr={swr}
      />
    )

    const dialog = screen.getByRole('Dialog')

    // Normal
    fireEvent.click(dialog)
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.existing,
        undefined
      )
    )

    unmount()
  })
})
