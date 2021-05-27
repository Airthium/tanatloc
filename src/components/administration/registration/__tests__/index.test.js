import Registration from '..'
import { shallow, mount } from 'enzyme'

jest.mock('@/components/loading', () => ({
  Simple: () => <div />
}))

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

  test('exists', () => {
    expect(wrapper).toBeDefined()
  })

  test('loading', () => {
    wrapper.unmount()
    mockLoadingSystem.mockImplementation(() => true)
    wrapper = shallow(<Registration />)
    expect(wrapper.find('Simple').length).toBe(1)
  })

  test('onAllowSignup', async () => {
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

  test('onPasswordFinish', async () => {
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

  // test('mount', () => {
  //   wrapper.unmount()
  //   wrapper = mount(<Registration />)
  //   expect(wrapper).toBeDefined()

  //   // Error
  //   wrapper.unmount()
  //   mockErrorSystem.mockImplementation(() => ({ message: 'Error' }))
  //   wrapper = mount(<Registration />)
  //   expect(mockError).toHaveBeenCalledTimes(1)
  // })
})
