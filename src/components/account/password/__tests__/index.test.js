import Password from '..'
import { shallow } from 'enzyme'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockUpdate = jest.fn()
const mockCheck = jest.fn()
jest.mock('@/api/user', () => ({
  useUser: () => [{}],
  update: () => mockUpdate(),
  check: () => mockCheck()
}))

let wrapper
describe('src/components/account/information', () => {
  beforeEach(() => {
    mockError.mockReset()

    mockUpdate.mockReset()
    mockCheck.mockReset()

    wrapper = shallow(<Password />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onFinish', async () => {
    mockCheck.mockImplementation(() => ({
      valid: true
    }))

    // Normal
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({
      newPassword: 'password',
      passwordConfirm: 'password'
    })
    expect(mockCheck).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Wrong password
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({
      newPassword: 'password',
      passwordConfirm: 'otherpassword'
    })
    expect(mockCheck).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)

    // No check
    mockCheck.mockImplementation(() => ({
      valid: false
    }))
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({
      newPassword: 'password',
      passwordConfirm: 'password'
    })
    expect(mockCheck).toHaveBeenCalledTimes(3)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)

    // Error
    mockCheck.mockImplementation(() => ({
      valid: true
    }))
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({
      newPassword: 'password',
      passwordConfirm: 'password'
    })
    expect(mockCheck).toHaveBeenCalledTimes(4)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(2)
  })
})
