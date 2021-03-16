import Index from '@/components/index/index'
import { shallow, mount } from 'enzyme'

import '@/config/jest/matchMediaMock'

const mockPrefetch = jest.fn()
const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    prefetch: mockPrefetch,
    push: mockPush
  })
}))

jest.mock('@/components/background', () => 'background')

const mockUser = jest.fn()
jest.mock('@/api/user', () => ({
  useUser: () => [mockUser()]
}))

let wrapper
describe('components/index', () => {
  beforeEach(() => {
    mockPrefetch.mockReset()
    mockPush.mockReset()
    mockUser.mockReset()
    wrapper = shallow(<Index />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onSelect', () => {
    // Handle nothing
    wrapper.find('Menu').props().onSelect({ item: 'item', key: 'key' })
    expect(mockPush).toHaveBeenCalledTimes(0)

    // Handle dashboard
    wrapper.find('Menu').props().onSelect({ item: 'item', key: 'dashboard' })
    expect(mockPush).toHaveBeenCalledTimes(1)

    // Handle signup
    wrapper.find('Menu').props().onSelect({ item: 'item', key: 'signup' })
    expect(mockPush).toHaveBeenCalledTimes(2)

    // Handle login
    wrapper.find('Menu').props().onSelect({ item: 'item', key: 'login' })
    expect(mockPush).toHaveBeenCalledTimes(3)
  })

  it('with user', () => {
    wrapper.unmount()
    mockUser.mockImplementation(() => ({}))
    wrapper = shallow(<Index />)
    expect(wrapper.find('Menu').props().children.props.children).toBe(
      'Dashboard'
    )
  })

  it('effect', () => {
    wrapper.unmount()

    wrapper = mount(<Index />)
    expect(mockPrefetch).toHaveBeenCalledTimes(3)
  })
})
