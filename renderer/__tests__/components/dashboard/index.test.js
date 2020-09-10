import Dashboard from '../../../components/dashboard'
import { shallow, mount } from 'enzyme'

import '../../../../config/jest/matchMediaMock'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    replace: mockRouter
  })
}))

jest.mock('../../../components/loading', () => 'loading')

jest.mock('../../../components/workspace', () => 'workspace')

jest.mock('../../../components/account', () => 'account')

jest.mock('../../../components/help', () => 'help')

let mockUser = () => ({
  id: 'id'
})
let mockUserLoading
jest.mock('../../../../src/api/user/useUser', () => () => [
  mockUser(),
  { mutateUser: () => {}, loadingUser: mockUserLoading() }
])

let mockWorkspaces
jest.mock('../../../../src/api/workspace/useWorkspaces', () => () => [
  mockWorkspaces()
])

const mockLogout = jest.fn()
jest.mock('../../../../src/api/logout', () => () => mockLogout())

let wrapper
describe('renderer/components/dashboard', () => {
  beforeEach(() => {
    mockRouter.mockReset()
    mockLogout.mockReset()
    mockUser = () => ({ id: 'id' })
    mockUserLoading = () => false
    mockWorkspaces = () => []
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

    mockUserLoading = () => true
    wrapper = shallow(<Dashboard />)
    expect(wrapper.find('loading').length).toBe(1)
  })

  it('with workspaces', () => {
    wrapper.unmount()

    mockWorkspaces = () => [
      {
        id: 'id',
        name: 'name',
        owners: ['id']
      },
      {
        id: 'id',
        name: 'name',
        users: ['id']
      },
      {
        id: 'id',
        name: 'name'
      }
    ]
    wrapper = shallow(<Dashboard />)

    const myWorkspaces = wrapper.find({ title: 'My Workspaces' }).props()
      .children
    expect(myWorkspaces.filter((w) => w).length).toBe(1)

    const sharedWorkspaces = wrapper.find({ title: 'Shared With Me' }).props()
      .children
    expect(sharedWorkspaces.filter((w) => w).length).toBe(1)
  })

  it('user effect', () => {
    let mWrapper

    // Without user
    mWrapper = mount(<Dashboard />)
    expect(mockRouter).toHaveBeenCalledTimes(0)
    mWrapper.unmount()

    // With user
    mockUser = () => {}
    mWrapper = mount(<Dashboard />)
    expect(mockRouter).toHaveBeenCalledTimes(1)
    mWrapper.unmount()
  })

  it('workspace effect', () => {
    wrapper.unmount()

    mockWorkspaces = () => [{}, { id: 'id' }]
    wrapper = mount(<Dashboard />)
  })

  it('onSelect', () => {
    // My workspaces
    wrapper
      .find('Menu')
      .props()
      .onSelect({
        item: { props: { subMenuKey: 'my_workspaces-menu-' } },
        key: 'my_workspaces1'
      })
    expect(wrapper.find('workspace').length).toBe(1)

    // Shared with me
    wrapper
      .find('Menu')
      .props()
      .onSelect({
        item: { props: { subMenuKey: 'shared-menu-' } },
        key: 'shared1'
      })
    expect(wrapper.find('workspace').length).toBe(1)

    // Account
    wrapper
      .find('Menu')
      .props()
      .onSelect({ item: { props: { subMenuKey: '-menu-0' } }, key: 'account' })
    expect(wrapper.find('account').length).toBe(1)

    // Help
    wrapper
      .find('Menu')
      .props()
      .onSelect({ item: { props: { subMenuKey: '-menu-0' } }, key: 'help' })
    expect(wrapper.find('help').length).toBe(1)

    // Logout
    wrapper
      .find('Menu')
      .props()
      .onSelect({ item: { props: { subMenuKey: '-menu-0' } }, key: 'logout' })
    expect(mockLogout).toHaveBeenCalledTimes(1)

    // Unknown
    wrapper
      .find('Menu')
      .props()
      .onSelect({
        item: { props: { subMenuKey: 'unknown-menu-' } },
        key: 'unknown1'
      })
    expect(wrapper.find('workspace').length).toBe(0)
    expect(wrapper.find('account').length).toBe(0)
    expect(wrapper.find('help').length).toBe(0)
  })
})
