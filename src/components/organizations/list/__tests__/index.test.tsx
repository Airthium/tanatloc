import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { IFrontOrganizationsItem } from '@/api/index.d'

import List, { errors } from '..'

const mockErrorNotification = jest.fn()
jest.mock('@/context/notification/actions', () => ({
  addError: ({ title, err }: { title: string; err: Error }) =>
    mockErrorNotification(title, err)
}))

const mockOrganizationQuit = jest.fn()
const mockOrganizationAccept = jest.fn()
const mockOrganizationDecline = jest.fn()
jest.mock('@/api/organization', () => ({
  quit: async () => mockOrganizationQuit(),
  accept: async () => mockOrganizationAccept(),
  decline: async () => mockOrganizationDecline()
}))

const mockUserToAvatar = jest.fn()
const mockGroupToAvatar = jest.fn()
jest.mock('@/lib/utils', () => ({
  userToAvatar: () => mockUserToAvatar(),
  groupToAvatar: () => mockGroupToAvatar(),
  deepCopy: (obj: any) => JSON.parse(JSON.stringify(obj))
}))

jest.mock('../../delete', () => () => <div />)

describe('components/organizations/list', () => {
  const user = { id: 'idu' }
  const organizations = [
    {
      id: 'id1',
      name: 'Name1',
      owners: [{ id: 'idu' } as IFrontOrganizationsItem['owners'][0]],
      pendingowners: [],
      users: [{ id: 'id1' } as IFrontOrganizationsItem['users'][0]],
      pendingusers: [],
      groups: [{ id: 'id1' } as IFrontOrganizationsItem['groups'][0]]
    },
    {
      id: 'id2',
      name: 'Name2',
      owners: [{ id: 'id2' } as IFrontOrganizationsItem['owners'][0]],
      pendingowners: [],
      users: [{ id: 'id2' } as IFrontOrganizationsItem['users'][0]],
      pendingusers: [],
      groups: [{ id: 'id2' } as IFrontOrganizationsItem['groups'][0]]
    }
  ]
  const swr = {
    mutateOneOrganization: jest.fn(),
    delOneOrganization: jest.fn(),
    loadingOrganizations: false
  }
  const setOrganization = jest.fn()

  beforeEach(() => {
    mockErrorNotification.mockReset()

    mockOrganizationQuit.mockReset()
    mockOrganizationAccept.mockReset()
    mockOrganizationDecline.mockReset()

    mockUserToAvatar.mockReset()
    mockGroupToAvatar.mockReset()

    swr.mutateOneOrganization.mockReset()
    swr.delOneOrganization.mockReset()
    setOrganization.mockReset()
  })

  test('render', async () => {
    const { unmount } = render(
      <List
        user={user}
        organizations={organizations}
        swr={swr}
        setOrganization={setOrganization}
      />
    )

    await waitFor(() => expect(mockUserToAvatar).toHaveBeenCalled())
    await waitFor(() => expect(mockGroupToAvatar).toHaveBeenCalled())

    unmount()
  })

  test('columns', () => {
    const { unmount } = render(
      <List
        user={user}
        organizations={organizations}
        swr={swr}
        setOrganization={setOrganization}
      />
    )

    // Set organization
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(setOrganization).toHaveBeenCalledTimes(1)

    // Sorter
    const sorter = screen.getByText('Name')
    fireEvent.click(sorter)

    unmount()
  })

  test('without name', () => {
    const { unmount } = render(
      <List
        user={user}
        organizations={[
          {
            id: 'id1',
            //@ts-ignore
            name: undefined,
            owners: [{ id: 'idu' } as IFrontOrganizationsItem['owners'][0]],
            pendingowners: [],
            users: [{ id: 'id1' } as IFrontOrganizationsItem['users'][0]],
            pendingusers: [],
            groups: [{ id: 'id1' } as IFrontOrganizationsItem['groups'][0]]
          },
          {
            id: 'id2',
            //@ts-ignore
            name: undefined,
            owners: [{ id: 'id2' } as IFrontOrganizationsItem['owners'][0]],
            pendingowners: [],
            users: [{ id: 'id2' } as IFrontOrganizationsItem['users'][0]],
            pendingusers: [],
            groups: [{ id: 'id2' } as IFrontOrganizationsItem['groups'][0]]
          }
        ]}
        swr={swr}
        setOrganization={setOrganization}
      />
    )

    // Set organization
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(setOrganization).toHaveBeenCalledTimes(1)

    // Sorter
    const sorter = screen.getByText('Name')
    fireEvent.click(sorter)

    unmount()
  })

  test('quit', async () => {
    const { unmount } = render(
      <List
        user={user}
        organizations={[
          {
            id: 'id1',
            name: 'Name1',
            owners: [{ id: 'id1' } as IFrontOrganizationsItem['owners'][0]],
            pendingowners: [],
            users: [{ id: 'idu' } as IFrontOrganizationsItem['users'][0]],
            pendingusers: [],
            groups: [{ id: 'id1' } as IFrontOrganizationsItem['groups'][0]]
          }
        ]}
        swr={swr}
        setOrganization={setOrganization}
      />
    )

    const button = screen.getByRole('button')

    // Normal
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(mockOrganizationQuit).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneOrganization).toHaveBeenCalledTimes(1)
    )

    // Error
    mockOrganizationQuit.mockImplementation(() => {
      throw new Error('quit error')
    })
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(mockOrganizationQuit).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.quit,
        new Error('quit error')
      )
    )

    unmount()
  })

  test('accept (owner)', async () => {
    const { unmount } = render(
      <List
        user={user}
        organizations={[
          {
            id: 'id1',
            name: 'Name1',
            owners: [{ id: 'id1' } as IFrontOrganizationsItem['owners'][0]],
            pendingowners: [
              { id: 'idu' } as IFrontOrganizationsItem['pendingowners'][0]
            ],
            users: [{ id: 'id1' } as IFrontOrganizationsItem['users'][0]],
            pendingusers: [
              { id: 'id1' } as IFrontOrganizationsItem['pendingusers'][0]
            ],
            groups: [{ id: 'id1' } as IFrontOrganizationsItem['groups'][0]]
          }
        ]}
        swr={swr}
        setOrganization={setOrganization}
      />
    )

    const buttons = screen.getAllByRole('button')

    // Normal
    await act(() => fireEvent.click(buttons[0]))
    await waitFor(() => expect(mockOrganizationAccept).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneOrganization).toHaveBeenCalledTimes(1)
    )

    // Error
    mockOrganizationAccept.mockImplementation(() => {
      throw new Error('accept error')
    })
    await act(() => fireEvent.click(buttons[0]))
    await waitFor(() => expect(mockOrganizationAccept).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.accept,
        new Error('accept error')
      )
    )

    unmount()
  })

  test('decline (owner)', async () => {
    const { unmount } = render(
      <List
        user={user}
        organizations={[
          {
            id: 'id1',
            name: 'Name1',
            owners: [{ id: 'id1' } as IFrontOrganizationsItem['owners'][0]],
            pendingowners: [
              { id: 'idu' } as IFrontOrganizationsItem['pendingowners'][0]
            ],
            users: [{ id: 'id1' } as IFrontOrganizationsItem['users'][0]],
            pendingusers: [
              { id: 'id1' } as IFrontOrganizationsItem['pendingusers'][0]
            ],
            groups: [{ id: 'id1' } as IFrontOrganizationsItem['groups'][0]]
          }
        ]}
        swr={swr}
        setOrganization={setOrganization}
      />
    )

    const buttons = screen.getAllByRole('button')

    // Normal
    await act(() => fireEvent.click(buttons[1]))
    await waitFor(() =>
      expect(mockOrganizationDecline).toHaveBeenCalledTimes(1)
    )
    await waitFor(() =>
      expect(swr.mutateOneOrganization).toHaveBeenCalledTimes(1)
    )

    // Error
    mockOrganizationDecline.mockImplementation(() => {
      throw new Error('decline error')
    })
    await act(() => fireEvent.click(buttons[1]))
    await waitFor(() =>
      expect(mockOrganizationDecline).toHaveBeenCalledTimes(2)
    )
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.decline,
        new Error('decline error')
      )
    )

    unmount()
  })

  test('accept (user)', async () => {
    const { unmount } = render(
      <List
        user={user}
        organizations={[
          {
            id: 'id1',
            name: 'Name1',
            owners: [{ id: 'id1' } as IFrontOrganizationsItem['owners'][0]],
            pendingowners: [
              { id: 'id1' } as IFrontOrganizationsItem['pendingowners'][0]
            ],
            users: [{ id: 'id1' } as IFrontOrganizationsItem['users'][0]],
            pendingusers: [
              { id: 'idu' } as IFrontOrganizationsItem['pendingusers'][0]
            ],
            groups: [{ id: 'id1' } as IFrontOrganizationsItem['groups'][0]]
          }
        ]}
        swr={swr}
        setOrganization={setOrganization}
      />
    )

    const buttons = screen.getAllByRole('button')

    // Normal
    await act(() => fireEvent.click(buttons[0]))
    await waitFor(() => expect(mockOrganizationAccept).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneOrganization).toHaveBeenCalledTimes(1)
    )

    // Error
    mockOrganizationAccept.mockImplementation(() => {
      throw new Error('accept error')
    })
    await act(() => fireEvent.click(buttons[0]))
    await waitFor(() => expect(mockOrganizationAccept).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.accept,
        new Error('accept error')
      )
    )

    unmount()
  })

  test('decline (user)', async () => {
    const { unmount } = render(
      <List
        user={user}
        organizations={[
          {
            id: 'id1',
            name: 'Name1',
            owners: [{ id: 'id1' } as IFrontOrganizationsItem['owners'][0]],
            pendingowners: [
              { id: 'id1' } as IFrontOrganizationsItem['pendingowners'][0]
            ],
            users: [{ id: 'id1' } as IFrontOrganizationsItem['users'][0]],
            pendingusers: [
              { id: 'idu' } as IFrontOrganizationsItem['pendingusers'][0]
            ],
            groups: [{ id: 'id1' } as IFrontOrganizationsItem['groups'][0]]
          }
        ]}
        swr={swr}
        setOrganization={setOrganization}
      />
    )

    const buttons = screen.getAllByRole('button')

    // Normal
    await act(() => fireEvent.click(buttons[1]))
    await waitFor(() =>
      expect(mockOrganizationDecline).toHaveBeenCalledTimes(1)
    )
    await waitFor(() =>
      expect(swr.mutateOneOrganization).toHaveBeenCalledTimes(1)
    )

    // Error
    mockOrganizationDecline.mockImplementation(() => {
      throw new Error('decline error')
    })
    await act(() => fireEvent.click(buttons[1]))
    await waitFor(() =>
      expect(mockOrganizationDecline).toHaveBeenCalledTimes(2)
    )
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.decline,
        new Error('decline error')
      )
    )

    unmount()
  })

  test('accept (user, no users)', async () => {
    const { unmount } = render(
      <List
        user={user}
        organizations={[
          {
            id: 'id1',
            name: 'Name1',
            owners: [{ id: 'id1' } as IFrontOrganizationsItem['owners'][0]],
            pendingowners: [
              { id: 'id1' } as IFrontOrganizationsItem['pendingowners'][0]
            ],
            users: [{ id: 'id1' } as IFrontOrganizationsItem['users'][0]],
            pendingusers: [
              { id: 'idu' } as IFrontOrganizationsItem['pendingusers'][0]
            ],
            groups: [{ id: 'id1' } as IFrontOrganizationsItem['groups'][0]]
          }
        ]}
        swr={swr}
        setOrganization={setOrganization}
      />
    )

    const buttons = screen.getAllByRole('button')

    // Normal
    await act(() => fireEvent.click(buttons[0]))
    await waitFor(() => expect(mockOrganizationAccept).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneOrganization).toHaveBeenCalledTimes(1)
    )

    unmount()
  })

  test('onResize', () => {
    Object.defineProperty(Element.prototype, 'clientHeight', {
      value: '1000'
    })

    const { unmount } = render(
      <List
        user={user}
        organizations={organizations}
        swr={swr}
        setOrganization={setOrganization}
      />
    )

    unmount()
  })
})
