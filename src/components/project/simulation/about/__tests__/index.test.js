import About from '@/components/project/simulation/about'
import { shallow, mount } from 'enzyme'

jest.mock('@/components/project/simulation/delete', () => 'delete')

const mockMutate = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  useSimulations: () => [[], { mutateOneSimulation: mockMutate }],
  update: async () => mockUpdate()
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

let wrapper
describe('components/project/simulation/about', () => {
  beforeEach(() => {
    mockMutate.mockReset()
    mockUpdate.mockReset()
    mockUpdate.mockImplementation(() => {})

    wrapper = shallow(<About simulation={{ scheme: {} }} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('handleName', async () => {
    await wrapper.find('Title').props().editable.onChange('name')
    expect(mockMutate).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(1)

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('Title').props().editable.onChange('name')
    expect(mockMutate).toHaveBeenCalledTimes(1)
  })

  it('effect', () => {
    wrapper.unmount()

    wrapper = mount(<About />)
  })
})
