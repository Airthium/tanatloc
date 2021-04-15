import Dashboard from '@/components/dashboard'
import { shallow, mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import '@/config/jest/mockMatchMedia'

const mockReplace = jest.fn()
const mockPush = jest.fn()
const mockQuery = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    replace: () => mockReplace(),
    push: () => mockPush(),
    query: mockQuery()
  })
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('@/components/loading', () => {
  const Loading = () => <div />
  return Loading
})

jest.mock('@/components/workspace', () => {
  const Workspace = () => <div />
  return Workspace
})

jest.mock('@/components/workspace/add', () => {
  const Add = () => <div />
  return Add
})

jest.mock('@/components/account', () => {
  const Account = () => <div />
  return Account
})

jest.mock('@/components/organizations', () => {
  const Organizations = () => <div />
  return Organizations
})

jest.mock('@/components/administration', () => {
  const Administration = () => <div />
  return Administration
})

jest.mock('@/components/help', () => {
  const Help = () => <div />
  return Help
})

jest.mock('@/components/dashboard/welcome', () => {
  const Welcome = () => <div />
  return Welcome
})

const mockUser = jest.fn()
const mockMutateUser = jest.fn()
const mockLoadingUser = jest.fn()
jest.mock('@/api/user', () => ({
  useUser: () => [
    mockUser(),
    { mutateUser: mockMutateUser, loadingUser: mockLoadingUser() }
  ]
}))

const mockOrganizations = jest.fn()
const mockReloadOrganizations = jest.fn()
const mockAddOneOrganization = jest.fn()
const mockDelOneOrganization = jest.fn()
const mockMutateOneOrganization = jest.fn()
const mockLoadingOrganizations = jest.fn()
jest.mock('@/api/organization', () => ({
  useOrganizations: () => [
    mockOrganizations(),
    {
      reloadOrganizations: mockReloadOrganizations,
      addOneOrganization: mockAddOneOrganization,
      delOneOrganization: mockDelOneOrganization,
      mutateOnOrganization: mockMutateOneOrganization,
      loadingOrganizations: mockLoadingOrganizations()
    }
  ]
}))

const mockWorkspaces = jest.fn()
const mockAddOneWorkspace = jest.fn()
const mockDelOneWorkspace = jest.fn()
const mockMutateOneWorkspace = jest.fn()
jest.mock('@/api/workspace', () => ({
  useWorkspaces: () => [
    mockWorkspaces(),
    {
      addOneWorkspace: mockAddOneWorkspace,
      delOneWorkspace: mockDelOneWorkspace,
      mutateOneWorkspace: mockMutateOneWorkspace
    }
  ]
}))

const mockLogout = jest.fn()
jest.mock('@/api/logout', () => () => mockLogout())

let wrapper
describe('components/dashboard', () => {
  beforeEach(() => {
    mockReplace.mockReset()
    mockPush.mockReset()
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({}))

    mockError.mockReset()

    mockUser.mockReset()
    mockUser.mockImplementation(() => ({ id: 'id', superuser: true }))
    mockMutateUser.mockReset()
    mockLoadingUser.mockReset()

    mockOrganizations.mockReset()
    mockReloadOrganizations.mockReset()
    mockAddOneOrganization.mockReset()
    mockDelOneOrganization.mockReset()
    mockMutateOneOrganization.mockReset()
    mockLoadingOrganizations.mockReset()

    mockWorkspaces.mockReset()
    mockWorkspaces.mockImplementation(() => [])
    mockAddOneWorkspace.mockReset()
    mockDelOneWorkspace.mockReset()
    mockMutateOneWorkspace.mockReset()

    mockLogout.mockReset()

    wrapper = shallow(<Dashboard />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('loading', () => {
    wrapper.unmount()
    mockLoadingUser.mockImplementation(() => true)
    wrapper = shallow(<Dashboard />)
    expect(wrapper.find('Loading').length).toBe(1)
  })

  it('onSelect', () => {
    // My workspaces
    wrapper
      .find('Menu')
      .props()
      .onClick({
        item: { props: { subMenuKey: 'my_workspaces-menu-' } },
        key: '1'
      })

    // Shared
    wrapper
      .find('Menu')
      .props()
      .onClick({
        item: { props: { subMenuKey: 'shared-menu-' } },
        key: '1'
      })

    // Account
    wrapper
      .find('Menu')
      .props()
      .onClick({ item: { props: { subMenuKey: '-menu-0' } }, key: 'account' })

    // Organizations
    wrapper
      .find('Menu')
      .props()
      .onClick({
        item: { props: { subMenuKey: '-menu-0' } },
        key: 'organizations'
      })

    // Administration
    wrapper
      .find('Menu')
      .props()
      .onClick({
        item: { props: { subMenuKey: '-menu-0' } },
        key: 'administration'
      })

    // Help
    wrapper
      .find('Menu')
      .props()
      .onClick({ item: { props: { subMenuKey: '-menu-0' } }, key: 'help' })

    // Logout
    wrapper
      .find('Menu')
      .props()
      .onClick({ item: { props: { subMenuKey: '-menu-0' } }, key: 'logout' })
    expect(mockLogout).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Logout error
    mockLogout.mockImplementation(() => {
      throw new Error()
    })
    wrapper
      .find('Menu')
      .props()
      .onClick({ item: { props: { subMenuKey: '-menu-0' } }, key: 'logout' })
    expect(mockLogout).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)

    // Unknown
    wrapper
      .find('Menu')
      .props()
      .onClick({
        item: { props: { subMenuKey: 'unknown-menu-' } },
        key: 'unknown1'
      })
  })

  it('onMyWorkspaces', () => {
    wrapper.find('SubMenu').at(0).props().onTitleClick()
  })

  it('onSharedWorkspaces', () => {
    wrapper.find('SubMenu').at(1).props().onTitleClick()
  })

  it('effect', () => {
    // No user
    wrapper.unmount()
    mockUser.mockImplementation(() => {})
    wrapper = mount(<Dashboard />)

    // User & workspaces
    wrapper.unmount()
    mockUser.mockImplementation(() => ({ id: 'id', groups: [{ id: 'id' }] }))
    mockWorkspaces.mockImplementation(() => [
      { id: 'id1', owners: [{ id: 'id' }] },
      { id: 'id2', users: [{ id: 'id' }] },
      { id: 'id3', groups: [{ id: 'id' }] }
    ])
    wrapper = mount(<Dashboard />)

    // On select
    act(() =>
      wrapper
        .find('Menu')
        .at(1)
        .props()
        .onClick({
          item: { props: { subMenuKey: 'my_workspaces-menu-' } },
          key: 'id1'
        })
    )

    act(() =>
      wrapper
        .find('Menu')
        .at(1)
        .props()
        .onClick({
          item: { props: { subMenuKey: 'shared-menu-' } },
          key: 'id2'
        })
    )

    // On my workspaces
    wrapper.find('SubMenu').at(0).props().onTitleClick()

    // On shared workspaces
    wrapper.find('SubMenu').at(2).props().onTitleClick()
  })

  // it('effect with router', () => {
  //   wrapper.unmount()
  //   mockUser.mockImplementation(() => ({ id: 'id', groups: [{ id: 'id' }] }))
  //   mockWorkspaces.mockImplementation(() => [
  //     { id: 'id1', owners: [{ id: 'id' }] },
  //     { id: 'id2', users: [{ id: 'id' }] },
  //     { id: 'id3', groups: [{ id: 'id' }] }
  //   ])

  //   // My workspaces
  //   mockQuery.mockImplementation(() => ({
  //     workspaceId: 'id1'
  //   }))
  //   wrapper = mount(<Dashboard />)

  //   // Shared workspaces
  //   wrapper.unmount()
  //   mockQuery.mockImplementation(() => ({
  //     workspaceId: 'id2'
  //   }))
  //   wrapper = mount(<Dashboard />)

  //   // Page
  //   wrapper.unmount()
  //   mockQuery.mockImplementation(() => ({
  //     page: 'organizations'
  //   }))
  //   wrapper = mount(<Dashboard />)

  //   // Without user & organizations
  //   wrapper.unmount()
  //   mockUser.mockImplementation(() => {})
  //   mockOrganizations.mockImplementation(() => [])
  //   mockQuery.mockImplementation(() => ({
  //     page: 'account'
  //   }))
  //   wrapper = mount(<Dashboard />)

  //   wrapper.unmount()
  //   mockQuery.mockImplementation(() => ({
  //     page: 'organizations'
  //   }))
  //   wrapper = mount(<Dashboard />)
  // })

  // it('effect workspace update', () => {
  //   wrapper.unmount()
  //   const name = jest.fn(() => 'name')
  //   mockUser.mockImplementation(() => ({ id: 'id' }))
  //   mockWorkspaces.mockImplementation(() => [
  //     { id: 'id', name: name(), owners: [{ id: 'id' }] }
  //   ])
  //   wrapper = mount(<Dashboard />)

  //   act(() =>
  //     wrapper
  //       .find('Menu')
  //       .at(1)
  //       .props()
  //       .onClick({
  //         item: { props: { subMenuKey: 'my_workspaces-menu-' } },
  //         key: 'id'
  //       })
  //   )

  //   // Update name
  //   name.mockImplementation(() => 'new_name')

  //   act(() =>
  //     wrapper
  //       .find('Menu')
  //       .at(1)
  //       .props()
  //       .onClick({
  //         item: { props: { subMenuKey: 'my_workspaces-menu-' } },
  //         key: 'id'
  //       })
  //   )
  // })
})
