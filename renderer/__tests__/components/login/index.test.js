import Login from '../../../components/login'
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

// jest.mock('../../../components/background', () => 'background')

const mockLogin = jest.fn()
jest.mock('..∕../../../src/api/login', () => async () => mockLogin())

const mockUser = jest.fn()
const mockUserLoading = jest.fn()
jest.mock('../../../../src/api/user/useUser', () => () => [
  mockUser(),
  { mutateUser: () => {}, loadingUser: mockUserLoading() }
])

let wrapper
describe('components/login', () => {
  beforeEach(() => {
    mockPrefetch.mockReset()
    mockPush.mockReset()
    mockLogin.mockReset()
    mockUser.mockReset()
    mockUserLoading.mockReset()
    mockUserLoading.mockImplementation(() => false)
    wrapper = shallow(<Login />)
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
    wrapper = shallow(<Login />)
    expect(wrapper.find('loading').length).toBe(1)
  })

  it('user effect', () => {
    let mWrapper = mount(<Login />)
    expect(mockPrefetch).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledTimes(0)
    mWrapper.unmount()

    mockUser.mockImplementation(() => ({ user: { id: 'id' } }))
    mWrapper = mount(<Login />)
    expect(mockPrefetch).toHaveBeenCalledTimes(2)
    expect(mockPush).toHaveBeenCalledTimes(1)
    mWrapper.unmount()
  })

  it('onLogin', async () => {
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
    expect(mockPush).toHaveBeenCalledTimes(0)

    mockLogin.mockImplementation(() => ({}))
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
    expect(mockPush).toHaveBeenCalledTimes(1)

    mockLogin.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
    expect(mockPush).toHaveBeenCalledTimes(1)
  })
})
