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

const mockLogin = jest.fn()
jest.mock('../../../../src/api/login', () => async () => mockLogin())

const mockUser = jest.fn()
const mockLoading = jest.fn()
const mockMutate = jest.fn()
const mockAdd = jest.fn()
jest.mock('../../../../src/api/user', () => ({
  useUser: () => [
    mockUser(),
    { loadingUser: mockLoading(), mutateUser: mockMutate }
  ],
  add: async () => mockAdd()
}))

let wrapper
describe('renderer/components/signup', () => {
  beforeEach(() => {
    mockPrefetch.mockReset()
    mockPush.mockReset()
    mockUser.mockReset()
    mockLoading.mockReset()
    mockMutate.mockReset()
    mockAdd.mockReset()
    mockLogin.mockReset()
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
    // Password mismatch
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({
      username: 'username',
      password: 'password',
      passwordConfirmation: 'other_password'
    })

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
    expect(mockLogin).toHaveBeenCalledTimes(1)
  })

  it('onSignupFailed', () => {
    wrapper.find('ForwardRef(InternalForm)').props().onFinishFailed({
      username: 'username',
      password: 'password',
      passwordConfirmation: 'other_password'
    })
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

    wrapper
      .find({ name: 'username' })
      .props()
      .extra.props.children[2].props.onClick()
    expect(mockPush).toHaveBeenCalledTimes(1)
  })

  it('effect', () => {
    wrapper.unmount()
    wrapper = mount(<Signup />)
    expect(mockPrefetch).toHaveBeenCalledTimes(2)
    expect(mockPush).toHaveBeenCalledTimes(0)

    wrapper.unmount()
    mockUser.mockImplementation(() => ({}))
    wrapper = mount(<Signup />)
    expect(mockPrefetch).toHaveBeenCalledTimes(4)
    expect(mockPush).toHaveBeenCalledTimes(1)
  })
})
