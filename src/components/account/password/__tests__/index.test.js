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

const mockSystem = jest.fn()
jest.mock('@/api/system', () => ({
  useSystem: () => [mockSystem()]
}))

let wrapper
describe('src/components/account/information', () => {
  beforeEach(() => {
    mockError.mockReset()

    mockUpdate.mockReset()
    mockCheck.mockReset()

    mockSystem.mockReset()
    mockSystem.mockImplementation(() => ({}))

    wrapper = shallow(<Password />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('password mismatch', async () => {
    // Match
    await wrapper
      .find({ name: 'passwordConfirm' })
      .props()
      .rules[1]({ getFieldValue: () => 'password' })
      .validator({}, 'password')

    // Mismatch
    try {
      await wrapper
        .find({ name: 'passwordConfirm' })
        .props()
        .rules[1]({ getFieldValue: () => 'password' })
        .validator({})
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }
  })

  it('with rules', () => {
    wrapper.unmount()
    mockSystem.mockImplementation(() => ({
      password: {
        min: 8,
        max: 64,
        requireLetter: true,
        requireNumber: true,
        requireSymbol: true
      }
    }))
    wrapper = shallow(<Password />)
    expect(wrapper.find({ name: 'newPassword' }).props().rules[1].min).toBe(8)
    expect(wrapper.find({ name: 'newPassword' }).props().rules[2].max).toBe(64)
    expect(
      wrapper.find({ name: 'newPassword' }).props().rules[3].pattern
    ).toBeDefined()
    expect(
      wrapper.find({ name: 'newPassword' }).props().rules[4].pattern
    ).toBeDefined()
    expect(
      wrapper.find({ name: 'newPassword' }).props().rules[5].pattern
    ).toBeDefined()
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

    // No check
    mockCheck.mockImplementation(() => ({
      valid: false
    }))
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({
      newPassword: 'password',
      passwordConfirm: 'password'
    })
    expect(mockCheck).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

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
    expect(mockCheck).toHaveBeenCalledTimes(3)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
  })
})
