import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Form } from 'antd'

import Group, { Delete, errors } from '..'

const mockAddButton = jest.fn()
const mockEditButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  AddButton: (props: any) => mockAddButton(props),
  EditButton: (props: any) => mockEditButton(props)
}))

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props: any) => mockDialog(props))

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

jest.mock('../delete', () => () => <div />)

const mockAdd = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@/api/group', () => ({
  add: async () => mockAdd(),
  update: async () => mockUpdate()
}))

describe('components/assets/group', () => {
  const userOptions = []
  const organization = {
    id: 'id',
    groups: [{ id: 'id' }]
  }
  const group = {
    id: 'id',
    name: 'name',
    users: [{ id: 'id' }]
  }
  const swr = {
    mutateOneOrganization: jest.fn(),
    addOneGroup: jest.fn(),
    mutateOneGroup: jest.fn()
  }

  beforeEach(() => {
    mockAddButton.mockReset()
    mockAddButton.mockImplementation(() => <div />)

    mockEditButton.mockReset()
    mockEditButton.mockImplementation(() => <div />)

    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    mockErrorNotification.mockReset()

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
    mockAddButton.mockImplementation((props) => (
      <div role="AddButton" onClick={props.onAdd} />
    ))
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(
      <Group userOptions={userOptions} organization={organization} swr={swr} />
    )

    const button = screen.getByRole('AddButton')
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
      throw new Error('add error')
    })
    fireEvent.click(dialog)
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

  test('onUpdate', async () => {
    mockEditButton.mockImplementation((props) => (
      <div role="EditButton" onClick={props.onEdit} />
    ))
    let name = 'name'
    mockDialog.mockImplementation((props) => (
      <div
        role="Dialog"
        onClick={async () => {
          try {
            await props.onOk({ id: 'id', name: name, users: ['id'] })
          } catch (err) {}
        }}
      >
        <Form>{props.children}</Form>
      </div>
    ))
    const { unmount } = render(
      <Group
        userOptions={userOptions}
        organization={organization}
        group={group}
        swr={swr}
      />
    )

    const button = screen.getByRole('EditButton')
    fireEvent.click(button)

    const dialog = screen.getByRole('Dialog')

    // Empty
    fireEvent.click(dialog)

    name = 'new name'
    // Normal
    fireEvent.click(dialog)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.addOneGroup).toHaveBeenCalledTimes(1))

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    fireEvent.click(dialog)
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
