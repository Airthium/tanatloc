import PasswordItem from '..'
import { shallow } from 'enzyme'

const mockSystem = jest.fn()
jest.mock('@/api/system', () => ({
  useSystem: () => [mockSystem()]
}))

let wrapper
describe('components/assets/input/password', () => {
  beforeEach(() => {
    mockSystem.mockReset()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('with rules', async () => {
    let validator
    mockSystem.mockImplementation(() => ({
      allowsignup: true,
      password: {
        min: 8,
        max: 16,
        requireLetter: true,
        requireNumber: true,
        requireSymbol: true
      }
    }))
    wrapper = shallow(<PasswordItem name="password" />)

    validator = wrapper.find({ name: 'password' }).props().rules[0]().validator

    try {
      await validator(null, '')
    } catch (err) {
      expect(err.message).toBe('Please enter a password')
    }

    try {
      await validator(null, 'small')
    } catch (err) {
      expect(err.message).toBe('Your password is too small')
    }

    try {
      await validator(null, 'longlonglonglonglonglong')
    } catch (err) {
      expect(err.message).toBe('Your password is too long')
    }

    try {
      await validator(null, '12345678')
    } catch (err) {
      expect(err.message).toBe('Your password must contain a letter')
    }

    try {
      await validator(null, 'abcdefgh')
    } catch (err) {
      expect(err.message).toBe('Your password must contain a number')
    }

    try {
      await validator(null, 'abcd1234')
    } catch (err) {
      expect(err.message).toBe('Your password must contain a symbol')
    }

    await validator(null, 'abcd1234&')

    wrapper.unmount()
    mockSystem.mockImplementation(() => ({
      allowsignup: true,
      password: {
        requireLetter: false,
        requireNumber: false,
        requireSymbol: false
      }
    }))
    wrapper = shallow(<PasswordItem edit={true} />)

    validator = wrapper.find({ name: 'password' }).props().rules[0]().validator

    await validator(null, '******')

    try {
      await validator(null, 'small')
    } catch (err) {
      expect(err.message).toBe('Your password is too small')
    }

    try {
      await validator(null, 'longlonglonglonglonglong')
    } catch (err) {
      expect(err.message).toBe('Your password is too long')
    }
  })
})
