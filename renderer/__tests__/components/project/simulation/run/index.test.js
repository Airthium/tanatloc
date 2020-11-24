import Run from '../../../../../components/project/simulation/run'
import { shallow, mount } from 'enzyme'

const mockRun = jest.fn()
const mockUpdate = jest.fn()
const mockMutate = jest.fn()
jest.mock('../../../../../../src/api/simulation', () => ({
  run: async () => mockRun(),
  update: async () => mockUpdate(),
  useSimulations: () => [[], { mutateOneSimulation: mockMutate }]
}))

const mockSentry = jest.fn()
jest.mock('../../../../../../src/lib/sentry', () => ({
  captureException: () => mockSentry()
}))

let wrapper
describe('renderer/components/project/simulation/run', () => {
  const project = {}
  const simulation = {
    scheme: {
      configuration: {
        run: {}
      }
    }
  }

  beforeEach(() => {
    mockRun.mockReset()
    mockUpdate.mockReset()
    mockMutate.mockReset()
    mockSentry.mockReset()
    wrapper = shallow(<Run project={project} simulation={simulation} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onRun', async () => {
    await wrapper.find('Button').props().onClick()
    expect(mockRun).toHaveBeenCalledTimes(1)
    expect(mockSentry).toHaveBeenCalledTimes(0)

    // Error
    mockRun.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('Button').props().onClick()
    expect(mockRun).toHaveBeenCalledTimes(2)
    expect(mockSentry).toHaveBeenCalledTimes(1)
  })
})
