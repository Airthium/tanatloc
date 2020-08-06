import Dashboard from '../../../components/dashboard'
import { shallow, mount } from 'enzyme'

import '../../../../config/jest/matchMediaMock'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    replace: mockRouter
  })
}))

let mockUser = () => {}
jest.mock('../../../../src/api/user/useUser', () => () => [
  mockUser(),
  { mutate: () => {}, loading: false }
])

let mockWorkspace = () => {}
jest.mock('../../../../src/api/workspace/useWorkspace', () => () => [
  mockWorkspace()
])

const mockLogout = jest.fn()
jest.mock('../../../../src/api/logout', () => () => mockLogout())

let wrapper
describe('components/dashboard', () => {
  beforeEach(() => {
    mockRouter.mockReset()
    mockLogout.mockReset()
    mockUser = () => {}
    mockWorkspace = () => {}
    wrapper = shallow(<Dashboard />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('user and workspaces', () => {
    mockUser = () => ({
      id: 'id',
      username: 'username'
    })
    mockWorkspace = () => [
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
  })

  it('onSelect', () => {
    // My workspaces
    wrapper
      .find('Menu')
      .props()
      .onSelect({ item: { props: { subMenuKey: '-menu-1' } }, key: '1' })

    // Shared with me
    wrapper
      .find('Menu')
      .props()
      .onSelect({ item: { props: { subMenuKey: '-menu-2' } }, key: '1' })

    // Unknown
    wrapper
      .find('Menu')
      .props()
      .onSelect({ item: { props: { subMenuKey: '-menu-3' } }, key: '1' })

    // Account
    wrapper
      .find('Menu')
      .props()
      .onSelect({ item: { props: { subMenuKey: '-menu-0' } }, key: '3' })

    // Help
    wrapper
      .find('Menu')
      .props()
      .onSelect({ item: { props: { subMenuKey: '-menu-0' } }, key: '4' })

    // Logout
    wrapper
      .find('Menu')
      .props()
      .onSelect({ item: { props: { subMenuKey: '-menu-0' } }, key: '5' })
    expect(mockLogout).toHaveBeenCalledTimes(1)
  })

  it('user', () => {
    let mWrapper = mount(<Dashboard />)
    expect(mockRouter).toHaveBeenCalledTimes(1)
    mWrapper.unmount()

    mockUser = () => ({ user: { id: 'id' } })
    mWrapper = mount(<Dashboard />)
    expect(mockRouter).toHaveBeenCalledTimes(1)
    mWrapper.unmount()
  })
})
