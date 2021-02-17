import Registration from '..'
import { shallow, mount } from 'enzyme'

const mockGet = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@/api/system', () => ({
  get: async () => mockGet(),
  update: async () => mockUpdate()
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

let wrapper
describe('src/components/administration/registration', () => {
  beforeEach(() => {
    mockGet.mockReset()
    mockUpdate.mockReset()

    mockError.mockReset()

    wrapper = shallow(<Registration />)
  })

  it('exists', () => {
    expect(wrapper).toBeDefined()
  })

  it('onAllowSignup', async () => {
    // Normal
    await wrapper.find('Checkbox').props().onChange()
    expect(mockUpdate).toHaveBeenCalledTimes(1)

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('Checkbox').props().onChange()
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
  })

  it('effect', () => {
    wrapper.unmount()

    // Error
    wrapper = mount(<Registration />)
    expect(mockGet).toHaveBeenCalledTimes(1)

    // Normal
    wrapper.unmount()
    mockGet.mockImplementation(() => ({
      allowSignup: true
    }))
    wrapper = mount(<Registration />)
    expect(mockGet).toHaveBeenCalledTimes(2)
  })
})
