import About from '../../../../../components/project/simulation/about'
import { shallow, mount } from 'enzyme'

jest.mock('../../../../../components/project/simulation/delete', () => 'delete')

const mockMutate = jest.fn()
let mockUpdate
jest.mock('../../../../../../src/api/simulation', () => ({
  useSimulations: () => [[], { mutateOneSimulation: mockMutate }],
  update: async () => mockUpdate()
}))

jest.mock('../../../../../../src/lib/sentry', () => ({
  captureException: () => {}
}))

let wrapper
describe('renderer/components/project/simulation/about', () => {
  beforeEach(() => {
    mockMutate.mockReset()
    mockUpdate = () => {}
    wrapper = shallow(<About simulation={{ scheme: {} }} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('handleName', async () => {
    mockUpdate = jest.fn()
    await wrapper.find('Title').props().editable.onChange('name')
    expect(mockMutate).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(1)

    // Error
    mockUpdate = () => {
      throw new Error()
    }
    await wrapper.find('Title').props().editable.onChange('name')
    expect(mockMutate).toHaveBeenCalledTimes(1)
  })

  it('effect', () => {
    wrapper.unmount()

    wrapper = mount(<About />)
  })
})
