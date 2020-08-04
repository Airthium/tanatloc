import Dashboard from '../../../components/dashboard'
import { shallow, mount } from 'enzyme'

import '../../../../config/jest/matchMediaMock'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    replace: mockRouter
  })
}))

jest.mock('../../../components/project/list', () => 'list')

let mockUser = () => ({})
jest.mock('../../../../src/api/user/useUser', () => ({
  useUser: () => [mockUser(), { mutate: jest.fn(), loading: false }]
}))

jest.mock('../../../../src/api/logout', () => async () => {})

let wrapper
describe('components/dashboard', () => {
  beforeEach(() => {
    mockRouter.mockReset()
    wrapper = shallow(<Dashboard />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onSelect', () => {
    // Empty
    wrapper.find('Menu').props().onSelect({})

    // Workspaces
    wrapper.find('Menu').props().onSelect({ key: '1' })

    // Shared
    wrapper.find('Menu').props().onSelect({ key: '2' })

    // Account
    wrapper.find('Menu').props().onSelect({ key: '3' })

    // Help
    wrapper.find('Menu').props().onSelect({ key: '4' })

    // Logout
    wrapper.find('Menu').props().onSelect({ key: '5' })
  })

  it('user', () => {
    let mWrapper = mount(<Dashboard />)
    expect(mockRouter).toHaveBeenCalledTimes(0)
    mWrapper.unmount()

    mockUser = () => {}
    mWrapper = mount(<Dashboard />)
    expect(mockRouter).toHaveBeenCalledTimes(1)
    mWrapper.unmount()
  })
})
