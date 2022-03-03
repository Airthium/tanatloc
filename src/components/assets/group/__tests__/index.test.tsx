import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Group, { Delete } from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props) => mockDialog(props))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('../delete', () => () => <div />)

const mockAdd = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@/api/group', () => ({
  add: async () => mockAdd(),
  update: async () => mockUpdate()
}))

describe('components/assets/groups', () => {
  const userOptions = []
  const organization = {
    id: 'id'
  }
  const group = {
    id: 'id',
    name: 'name',
    users: [{ id: 'id' }]
  }
  const swr = {
    addOneGroup: jest.fn(),
    mutateOneGroup: jest.fn()
  }

  beforeEach(() => {
    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    mockError.mockReset()

    mockAdd.mockReset()
    mockUpdate.mockReset()
  })

  test('export', () => {
    expect(Delete).toBeDefined()
  })

  test('render', () => {
    const { unmount } = render(
      <Group userOptions={userOptions} organization={organization} swr={swr} />
    )

    unmount()
  })

  test('setVisible', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(
      <Group userOptions={userOptions} organization={organization} swr={swr} />
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('onAdd', async () => {
    mockDialog.mockImplementation((props) => (
      <div
        role="Dialog"
        onClick={async () => {
          try {
            await props.onOk({})
          } catch (err) {}
        }}
      />
    ))
    const { unmount } = render(
      <Group userOptions={userOptions} organization={organization} swr={swr} />
    )

    const dialog = screen.getByRole('Dialog')

    // Normal
    fireEvent.click(dialog)
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.addOneGroup).toHaveBeenCalledTimes(1))

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(dialog)
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('onUpdate', async () => {
    mockDialog.mockImplementation((props) => (
      <div
        role="Dialog"
        onClick={async () => {
          try {
            await props.onOk({ name: 'name', users: ['id'] })
          } catch (err) {}
        }}
      />
    ))
    const { unmount } = render(
      <Group
        userOptions={userOptions}
        organization={organization}
        group={group}
        swr={swr}
      />
    )

    const dialog = screen.getByRole('Dialog')

    // Normal
    fireEvent.click(dialog)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.addOneGroup).toHaveBeenCalledTimes(1))

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(dialog)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('onUpdate wit different users', async () => {
    mockDialog.mockImplementation((props) => (
      <div
        role="Dialog"
        onClick={async () => {
          try {
            await props.onOk({ name: 'name', users: ['id1'] })
          } catch (err) {}
        }}
      />
    ))
    const { unmount } = render(
      <Group
        userOptions={userOptions}
        organization={organization}
        group={group}
        swr={swr}
      />
    )

    const dialog = screen.getByRole('Dialog')

    fireEvent.click(dialog)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.addOneGroup).toHaveBeenCalledTimes(1))

    unmount()
  })

  it('onUpdate with modifications', async () => {
    mockDialog.mockImplementation((props) => (
      <div
        role="Dialog"
        onClick={async () => {
          try {
            await props.onOk({ name: 'other name', users: ['id1'] })
          } catch (err) {}
        }}
      />
    ))
    const { unmount } = render(
      <Group
        userOptions={userOptions}
        organization={organization}
        group={group}
        swr={swr}
      />
    )

    const dialog = screen.getByRole('Dialog')

    // Normal
    fireEvent.click(dialog)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.addOneGroup).toHaveBeenCalledTimes(1))

    unmount()
  })
})
