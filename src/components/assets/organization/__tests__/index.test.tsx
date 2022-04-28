import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Organization, { errors } from '..'

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

jest.mock('../users', () => () => <div />)

jest.mock('../groups', () => () => <div />)

const mockUpdate = jest.fn()
jest.mock('@/api/organization', () => ({
  update: async () => mockUpdate()
}))

describe('components/assets/organization', () => {
  const organization = {
    id: 'id',
    name: 'name',
    owners: [],
    pendingowners: [],
    users: [],
    pendingusers: [],
    groups: []
  }
  const swr = {
    mutateOneOrganization: jest.fn(),
    loadingOrganizations: false
  }
  const onClose = jest.fn()

  beforeEach(() => {
    mockErrorNotification.mockReset()

    mockUpdate.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Organization organization={organization} swr={swr} onClose={onClose} />
    )

    unmount()
  })

  test('onClose', () => {
    const { unmount } = render(
      <Organization organization={organization} swr={swr} onClose={onClose} />
    )

    const button = screen.getByRole('button', { name: 'arrow-left' })
    fireEvent.click(button)

    unmount()
  })

  test('onName', async () => {
    const { unmount } = render(
      <Organization organization={organization} swr={swr} onClose={onClose} />
    )

    // Normal
    {
      const edit = screen.getByRole('button', { name: 'Edit' })
      fireEvent.click(edit)

      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'new name' } })
      fireEvent.keyDown(input, {
        keyCode: 13
      })
      fireEvent.keyUp(input, {
        keyCode: 13
      })

      await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
      await waitFor(() =>
        expect(swr.mutateOneOrganization).toHaveBeenCalledTimes(1)
      )
    }

    // Error
    {
      mockUpdate.mockImplementation(() => {
        throw new Error('update error')
      })
      const edit = screen.getByRole('button', { name: 'Edit' })
      fireEvent.click(edit)

      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'new name' } })
      fireEvent.keyDown(input, {
        keyCode: 13
      })
      fireEvent.keyUp(input, {
        keyCode: 13
      })

      await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
      await waitFor(() =>
        expect(mockErrorNotification).toHaveBeenCalledTimes(1)
      )
      await waitFor(() =>
        expect(mockErrorNotification).toHaveBeenLastCalledWith(
          errors.name,
          new Error('update error')
        )
      )
    }

    unmount()
  })
})
