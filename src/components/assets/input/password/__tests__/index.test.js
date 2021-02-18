import PasswordItem from '..'
import { shallow } from 'enzyme'

const mockSystem = jest.fn()
jest.mock('@/api/system', () => ({
  useSystem: () => [mockSystem()]
}))

let wrapper
describe('src/components/assets/input/password', () => {
  beforeEach(() => {
    mockSystem.mockReset()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('with rules', () => {
    mockSystem.mockImplementation(() => ({
      allowsignup: true,
      password: {
        min: 8,
        max: 64,
        requireLetter: true,
        requireNumber: true,
        requireSymbol: true
      }
    }))
    wrapper = shallow(<PasswordItem />)
    expect(wrapper.find({ name: 'password' }).props().rules[1].min).toBe(8)
    expect(wrapper.find({ name: 'password' }).props().rules[2].max).toBe(64)
    expect(
      wrapper.find({ name: 'password' }).props().rules[3].pattern
    ).toBeDefined()
    expect(
      wrapper.find({ name: 'password' }).props().rules[4].pattern
    ).toBeDefined()
    expect(
      wrapper.find({ name: 'password' }).props().rules[5].pattern
    ).toBeDefined()

    wrapper.unmount()
    mockSystem.mockImplementation(() => ({
      allowsignup: true,
      password: {
        requireLetter: true,
        requireNumber: true,
        requireSymbol: true
      }
    }))
    wrapper = shallow(<PasswordItem />)
    expect(wrapper.find({ name: 'password' }).props().rules[1].min).toBe(6)
    expect(wrapper.find({ name: 'password' }).props().rules[2].max).toBe(16)
    expect(
      wrapper.find({ name: 'password' }).props().rules[3].pattern
    ).toBeDefined()
    expect(
      wrapper.find({ name: 'password' }).props().rules[4].pattern
    ).toBeDefined()
    expect(
      wrapper.find({ name: 'password' }).props().rules[5].pattern
    ).toBeDefined()
  })
})
