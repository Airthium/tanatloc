import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Group from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props) => mockDialog(props))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

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
    reloadOrganizations: jest.fn(),
    addOneGroup: jest.fn(),
    mutateOneGroup: jest.fn()
  }

  beforeEach(() => {
    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    mockError.mockReset()

    mockAdd.mockReset()
    mockUpdate.mockReset()

    swr.reloadOrganizations.mockReset()
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
      <div role="Dialog" onClick={props.onOk} />
    ))
    const { unmount } = render(
      <Group userOptions={userOptions} organization={organization} swr={swr} />
    )

    const dialog = screen.getByRole('Dialog')

    // Normal
    fireEvent.click(dialog)
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.addOneGroup).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.reloadOrganizations).toHaveBeenCalledTimes(1)
    )

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
        onClick={() => props.onOk({ name: 'name', users: [{ id: 'id' }] })}
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
    await waitFor(() =>
      expect(swr.reloadOrganizations).toHaveBeenCalledTimes(1)
    )

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(dialog)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  it('onUpdate with modifications', async () => {
    mockDialog.mockImplementation((props) => (
      <div
        role="Dialog"
        onClick={() =>
          props.onOk({ name: 'other name', users: [{ id: 'id1' }] })
        }
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
    await waitFor(() =>
      expect(swr.reloadOrganizations).toHaveBeenCalledTimes(1)
    )

    unmount()
  })

  test('propTypes', () => {
    let res
    const swrProp = Group.propTypes.swr

    res = swrProp({}, 'swr', 'Group')
    expect(res.message).toBe('Invalid prop swr supplied to Group. swr missing')

    res = swrProp({ swr: {} }, 'swr', 'Group')
    expect(res.message).toBe(
      'Invalid prop swr supplied to Group. addOneGroup missing or invalid'
    )

    res = swrProp({ swr: { addOneGroup: {} } }, 'swr', 'Group')
    expect(res.message).toBe(
      'Invalid prop swr supplied to Group. addOneGroup missing or invalid'
    )

    res = swrProp({ swr: { addOneGroup: jest.fn } }, 'swr', 'Group')
    expect(res.message).toBe(
      'Invalid prop swr supplied to Group. reloadOrganizations missing or invalid'
    )

    res = swrProp(
      { swr: { reloadOrganizations: {}, addOneGroup: jest.fn } },
      'swr',
      'Group'
    )
    expect(res.message).toBe(
      'Invalid prop swr supplied to Group. reloadOrganizations missing or invalid'
    )

    res = swrProp(
      { swr: { reloadOrganizations: jest.fn, addOneGroup: jest.fn } },
      'swr',
      'Group'
    )
    expect(res).toBe()

    res = swrProp(
      { swr: { reloadOrganizations: jest.fn }, group: {} },
      'swr',
      'Group'
    )
    expect(res.message).toBe(
      'Invalid prop swr supplied to Group. mutateOneGroup missing or invalid'
    )

    res = swrProp(
      { swr: { reloadOrganizations: jest.fn, mutateOneGroup: {} }, group: {} },
      'swr',
      'Group'
    )
    expect(res.message).toBe(
      'Invalid prop swr supplied to Group. mutateOneGroup missing or invalid'
    )

    res = swrProp(
      {
        swr: { reloadOrganizations: jest.fn, mutateOneGroup: jest.fn },
        group: {}
      },
      'swr',
      'Group'
    )
    expect(res).toBe()
  })
})
