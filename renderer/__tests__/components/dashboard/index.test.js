import Dashboard from '../../../components/dashboard'
import { shallow, mount } from 'enzyme'

import '../../../../config/jest/matchMediaMock'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    replace: mockRouter
  })
}))

jest.mock('../../../components/workspace', () => 'workspace')

let mockUser = () => {}
jest.mock('../../../../src/api/user/useUser', () => () => [
  mockUser(),
  { mutateUser: () => {}, loadingUser: false }
])

let mockWorkspaces = () => []
jest.mock('../../../../src/api/workspace/useWorkspaces', () => () => [
  mockWorkspaces(),
  { mutateWorkspaces: () => {}, loadingWorkspace: false }
])

const mockLogout = jest.fn()
jest.mock('../../../../src/api/logout', () => () => mockLogout())

let wrapper
describe('components/dashboard', () => {
  beforeEach(() => {
    mockRouter.mockReset()
    mockLogout.mockReset()
    mockUser = () => {}
    mockWorkspaces = () => []
    wrapper = shallow(<Dashboard />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('with workspaces', () => {
    mockUser = () => ({
      id: 'id'
    })
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
      }
    ]
    wrapper.unmount()
    wrapper = shallow(<Dashboard />)

    expect(
      wrapper.find({ title: 'My Workspaces' }).props().children.length
    ).toBe(2)
    // one is undefined
    expect(
      wrapper.find({ title: 'Shared With Me' }).props().children.length
    ).toBe(2)
    // one is undefined
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

    // Shared with me
    wrapper
      .find('Menu')
      .props()
      .onSelect({
        item: { props: { subMenuKey: 'shared-menu-' } },
        key: 'shared1'
      })

    // Unknown
    wrapper
      .find('Menu')
      .props()
      .onSelect({
        item: { props: { subMenuKey: 'unknown-menu-' } },
        key: 'unknown1'
      })

    // Account
    wrapper
      .find('Menu')
      .props()
      .onSelect({ item: { props: { subMenuKey: '-menu-0' } }, key: 'account' })

    // Help
    wrapper
      .find('Menu')
      .props()
      .onSelect({ item: { props: { subMenuKey: '-menu-0' } }, key: 'help' })

    // Logout
    wrapper
      .find('Menu')
      .props()
      .onSelect({ item: { props: { subMenuKey: '-menu-0' } }, key: 'logout' })
    expect(mockLogout).toHaveBeenCalledTimes(1)
  })

  it('user effect', () => {
    let mWrapper

    // Without user
    mWrapper = mount(<Dashboard />)
    expect(mockRouter).toHaveBeenCalledTimes(1)
    mWrapper.unmount()

    // With user
    mockUser = () => ({ user: { id: 'id' } })
    mWrapper = mount(<Dashboard />)
    expect(mockRouter).toHaveBeenCalledTimes(1)
    mWrapper.unmount()
  })

  it('default workspaces effect', () => {
    let mWrapper

    // With user
    mockUser = () => ({ id: 'id' })
    mWrapper = mount(<Dashboard />)
    mWrapper.unmount()

    // With workspaces (owner)
    mockWorkspaces = () => [
      {
        id: 'id',
        name: 'name',
        owners: ['id']
      }
    ]
    mWrapper = mount(<Dashboard />)
    mWrapper.unmount()

    // With workspaces (user)
    mockWorkspaces = () => [
      {
        id: 'id',
        name: 'name',
        users: ['id']
      }
    ]
    mWrapper = mount(<Dashboard />)
    mWrapper.unmount()

    // With workspaces (undefined)
    mockWorkspaces = () => [
      {
        id: 'id',
        name: 'name'
      }
    ]
    mWrapper = mount(<Dashboard />)
    mWrapper.unmount()
  })
})
