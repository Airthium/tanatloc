import Signup from '../../../components/signup'
import { shallow, mount } from 'enzyme'

import '../../../../config/jest/matchMediaMock'

const mockPrefetch = jest.fn()
const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    prefetch: mockPrefetch,
    push: mockPush
  })
}))

jest.mock('../../../components/loading', () => 'loading')

const mockUser = jest.fn()
const mockLoading = jest.fn()
jest.mock('../../../../src/api/user', () => ({
  useUser: () => [mockUser(), { loadingUser: mockLoading() }]
}))

let wrapper
describe('renderer/components/signup', () => {
  beforeEach(() => {
    mockPrefetch.mockReset()
    mockPush.mockReset()
    mockUser.mockReset()
    mockLoading.mockReset()
    wrapper = shallow(<Signup />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('with user', () => {
    wrapper.unmount()
    mockUser.mockImplementation(() => ({}))
    mockLoading.mockImplementation(() => false)
    wrapper = shallow(<Signup />)
  })

  it('effect', () => {
    wrapper.unmount()
    wrapper = mount(<Signup />)
    expect(mockPrefetch).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledTimes(0)

    wrapper.unmount()
    mockUser.mockImplementation(() => ({}))
    wrapper = mount(<Signup />)
    expect(mockPrefetch).toHaveBeenCalledTimes(2)
    expect(mockPush).toHaveBeenCalledTimes(1)
  })
})
