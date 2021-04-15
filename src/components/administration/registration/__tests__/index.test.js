import Registration from '..'
import { shallow, mount } from 'enzyme'

import '@/config/jest/mockMatchMedia'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockSystem = jest.fn()
const mockMutateSystem = jest.fn()
const mockErrorSystem = jest.fn()
const mockLoadingSystem = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@/api/system', () => ({
  useSystem: () => [
    mockSystem(),
    {
      mutateSystem: mockMutateSystem,
      errorSystem: mockErrorSystem(),
      loadingSystem: mockLoadingSystem()
    }
  ],
  update: async () => mockUpdate()
}))

let wrapper
describe('components/administration/registration', () => {
  beforeEach(() => {
    mockError.mockReset()

    mockSystem.mockReset()
    mockSystem.mockImplementation(() => ({}))
    mockMutateSystem.mockReset()
    mockLoadingSystem.mockReset()
    mockErrorSystem.mockReset()
    mockUpdate.mockReset()

    wrapper = shallow(<Registration />)
  })

  it('exists', () => {
    expect(wrapper).toBeDefined()
  })

  it('loading', () => {
    wrapper.unmount()
    mockLoadingSystem.mockImplementation(() => true)
    wrapper = shallow(<Registration />)
    expect(wrapper.find('Spin').length).toBe(1)
  })

  it('onAllowSignup', async () => {
    // Normal
    await wrapper.find('Checkbox').at(0).props().onChange()
    expect(mockUpdate).toHaveBeenCalledTimes(1)

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('Checkbox').at(0).props().onChange()
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
  })

  it('onPasswordFinish', async () => {
    // Normal
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockMutateSystem).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockMutateSystem).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })

  it('mount', () => {
    wrapper.unmount()
    wrapper = mount(<Registration />)
    expect(wrapper).toBeDefined()

    // Error
    wrapper.unmount()
    mockErrorSystem.mockImplementation(() => ({ message: 'Error' }))
    wrapper = mount(<Registration />)
    expect(mockError).toHaveBeenCalledTimes(1)
  })
})
