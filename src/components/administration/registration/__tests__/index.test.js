import Registration from '..'
import { shallow } from 'enzyme'

const mockSystem = jest.fn()
const mockMutateSystem = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@/api/system', () => ({
  useSystem: () => [mockSystem(), { mutateSystem: mockMutateSystem }],
  update: async () => mockUpdate()
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

let wrapper
describe('src/components/administration/registration', () => {
  beforeEach(() => {
    mockSystem.mockReset()
    mockSystem.mockImplementation(() => ({}))
    mockMutateSystem.mockReset()
    mockUpdate.mockReset()

    mockError.mockReset()

    wrapper = shallow(<Registration />)
  })

  it('exists', () => {
    expect(wrapper).toBeDefined()
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
})
