import Dashboard from '../../../components/dashboard'
import { act } from 'react-dom/test-utils'
import { shallow, mount } from 'enzyme'

import '../../../../config/jest/matchMediaMock'

const mockRouter = jest.fn()
const mockQuery = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    replace: mockRouter,
    push: () => {},
    query: mockQuery()
  })
}))

jest.mock('../../../components/loading', () => 'loading')

jest.mock('../../../components/dashboard/welcome', () => 'welcome')

jest.mock('../../../components/workspace', () => 'workspace')

jest.mock('../../../components/workspace/add', () => 'add')

jest.mock('../../../components/account', () => 'account')

jest.mock('../../../components/help', () => 'help')

const mockUser = jest.fn()
const mockUserLoading = jest.fn()
jest.mock('../../../../src/api/user/useUser', () => () => [
  mockUser(),
  { mutateUser: () => {}, loadingUser: mockUserLoading() }
])

const mockWorkspaces = jest.fn()
jest.mock('../../../../src/api/workspace/useWorkspaces', () => () => [
  mockWorkspaces()
])

const mockLogout = jest.fn()
jest.mock('../../../../src/api/logout', () => () => mockLogout())

let wrapper
describe('renderer/components/dashboard', () => {
  beforeEach(() => {
    mockRouter.mockReset()
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({}))

    mockUser.mockReset()
    mockUser.mockImplementation(() => ({ id: 'id' }))
    mockUserLoading.mockReset()
    mockUserLoading.mockImplementation(() => false)

    mockWorkspaces.mockReset()
    mockWorkspaces.mockImplementation(() => [])

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

    mockUserLoading.mockImplementation(() => true)
    wrapper = shallow(<Dashboard />)
    expect(wrapper.find('loading').length).toBe(1)
  })

  it('with workspaces', () => {
    wrapper.unmount()

    mockWorkspaces.mockImplementation(() => [
      {
        id: 'id',
        name: 'name',
        owners: [{ id: 'id' }]
      },
      {
        id: 'id',
        name: 'name',
        users: [{ id: 'id' }]
      },
      {
        id: 'id',
        name: 'name'
      }
    ])
    wrapper = shallow(<Dashboard />)

    const myWorkspaces = wrapper.find({ title: 'My Workspaces' }).props()
      .children
    expect(myWorkspaces.filter((w) => w).length).toBe(2)

    const sharedWorkspaces = wrapper.find({ title: 'Shared With Me' }).props()
      .children
    expect(sharedWorkspaces.filter((w) => w).length).toBe(1)

    // onWorkspaces with workspace
    wrapper.find('SubMenu').at(0).props().onTitleClick()
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
    expect(wrapper.find('workspace').length).toBe(1)

    // Shared with me
    wrapper
      .find('Menu')
      .props()
      .onClick({
        item: { props: { subMenuKey: 'shared-menu-' } },
        key: '1'
      })
    expect(wrapper.find('workspace').length).toBe(1)

    // Account
    wrapper
      .find('Menu')
      .props()
      .onClick({ item: { props: { subMenuKey: '-menu-0' } }, key: 'account' })
    expect(wrapper.find('account').length).toBe(1)

    // Help
    wrapper
      .find('Menu')
      .props()
      .onClick({ item: { props: { subMenuKey: '-menu-0' } }, key: 'help' })
    expect(wrapper.find('help').length).toBe(1)

    // Logout
    wrapper
      .find('Menu')
      .props()
      .onClick({ item: { props: { subMenuKey: '-menu-0' } }, key: 'logout' })
    expect(mockLogout).toHaveBeenCalledTimes(1)

    // Unknown
    wrapper
      .find('Menu')
      .props()
      .onClick({
        item: { props: { subMenuKey: 'unknown-menu-' } },
        key: 'unknown1'
      })
    expect(wrapper.find('workspace').length).toBe(0)
    expect(wrapper.find('account').length).toBe(0)
    expect(wrapper.find('help').length).toBe(0)
  })

  it('onWorkspaces', () => {
    wrapper.find('SubMenu').at(0).props().onTitleClick()
  })

  it('user effect', () => {
    wrapper.unmount()

    // With user
    wrapper = mount(<Dashboard />)
    expect(mockRouter).toHaveBeenCalledTimes(0)
    wrapper.unmount()

    // Without user
    mockUser.mockImplementation(() => {})
    wrapper = mount(<Dashboard />)
    expect(mockRouter).toHaveBeenCalledTimes(1)
  })

  it('workspace effect', () => {
    wrapper.unmount()

    let name = () => 'name'
    mockWorkspaces.mockImplementation(() => [{}, { id: 'id', name: name() }])
    wrapper = mount(<Dashboard />)

    act(() => {
      wrapper
        .find('InternalMenu')
        .props()
        .onClick({
          item: { props: { subMenuKey: 'my_workspaces-menu-' } },
          key: '1'
        })

      name = () => 'name1'
      wrapper
        .find('InternalMenu')
        .props()
        .onClick({
          item: { props: { subMenuKey: 'my_workspaces-menu-' } },
          key: '1'
        })
    })
  })

  it('page effect', () => {
    wrapper.unmount()

    mockQuery.mockImplementation(() => ({ page: 'page' }))
    wrapper = mount(<Dashboard />)
    wrapper.unmount()

    mockQuery.mockImplementation(() => ({ page: 'page', workspaceId: 'id' }))
    wrapper = mount(<Dashboard />)
    wrapper.unmount()

    mockWorkspaces.mockImplementation(() => [
      {
        id: 'id',
        owners: [{ id: 'id' }]
      }
    ])
    wrapper = mount(<Dashboard />)

    mockWorkspaces.mockImplementation(() => [
      {
        id: 'id',
        users: [{ id: 'id' }]
      }
    ])
    wrapper = mount(<Dashboard />)
  })
})
