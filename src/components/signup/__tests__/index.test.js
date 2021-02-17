import Signup from '@/components/signup'
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

jest.mock('@/components/loading', () => 'loading')

const mockLogin = jest.fn()
jest.mock('@/api/login', () => async () => mockLogin())

const mockUser = jest.fn()
const mockLoading = jest.fn()
const mockMutate = jest.fn()
const mockAdd = jest.fn()
jest.mock('@/api/user', () => ({
  useUser: () => [
    mockUser(),
    { loadingUser: mockLoading(), mutateUser: mockMutate }
  ],
  add: async () => mockAdd()
}))

const mockSystem = jest.fn()
jest.mock('@/api/system', () => ({
  useSystem: () => [mockSystem(), { loadingSystem: false }]
}))

let wrapper
describe('src/components/signup', () => {
  beforeEach(() => {
    mockPrefetch.mockReset()
    mockPush.mockReset()
    mockUser.mockReset()
    mockLoading.mockReset()
    mockMutate.mockReset()
    mockAdd.mockReset()
    mockLogin.mockReset()
    mockSystem.mockReset()
    mockSystem.mockImplementation(() => ({
      allowsignup: true
    }))
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

  it('onSignup', async () => {
    // Error
    mockAdd.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({
      username: 'username',
      password: 'password',
      passwordConfirmation: 'password'
    })

    // Already exists
    mockAdd.mockImplementation(() => ({
      alreadyExists: true
    }))
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({
      username: 'username',
      password: 'password',
      passwordConfirmation: 'password'
    })

    // Normal
    mockAdd.mockImplementation(() => ({}))
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({
      username: 'username',
      password: 'password',
      passwordConfirmation: 'password'
    })
    // expect(mockLogin).toHaveBeenCalledTimes(1)
  })

  it('mismatch passwords rule', async () => {
    // Match
    await wrapper
      .find({ name: 'passwordConfirmation' })
      .props()
      .rules[1]({ getFieldValue: () => 'password' })
      .validator({}, 'password')

    // Mismatch
    try {
      await wrapper
        .find({ name: 'passwordConfirmation' })
        .props()
        .rules[1]({ getFieldValue: () => 'password' })
        .validator({}, 'other_password')
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }
  })

  it('login', async () => {
    mockAdd.mockImplementation(() => ({
      alreadyExists: true
    }))
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({
      username: 'username',
      password: 'password',
      passwordConfirmation: 'password'
    })

    wrapper.find('Alert').props().message.props.children[4].props.onClick()
    expect(mockPush).toHaveBeenCalledTimes(1)
  })

  it('effect', () => {
    wrapper.unmount()
    mockSystem.mockImplementation(() => ({}))
    wrapper = mount(<Signup />)
    expect(mockPrefetch).toHaveBeenCalledTimes(2)
    expect(mockPush).toHaveBeenCalledTimes(0)

    wrapper.unmount()
    mockSystem.mockImplementation(async () => ({
      allowsignup: false
    }))
    wrapper = mount(<Signup />)
    expect(mockPrefetch).toHaveBeenCalledTimes(4)
    expect(mockPush).toHaveBeenCalledTimes(0)

    wrapper.unmount()
    mockUser.mockImplementation(() => ({}))
    wrapper = mount(<Signup />)
    expect(mockPrefetch).toHaveBeenCalledTimes(6)
    expect(mockPush).toHaveBeenCalledTimes(1)
  })
})
