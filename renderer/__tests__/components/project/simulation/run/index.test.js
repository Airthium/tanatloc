import Run from '../../../../../components/project/simulation/run'
import { shallow, mount } from 'enzyme'

import '../../../../../../config/jest/matchMediaMock'

const mockRun = jest.fn()
const mockUpdate = jest.fn()
const mockSimulation = jest.fn()
const mockMutateOneSimulation = jest.fn()
jest.mock('../../../../../../src/api/simulation', () => ({
  run: async () => mockRun(),
  update: async () => mockUpdate(),
  useSimulation: () => [mockSimulation()],
  useSimulations: () => [, { mutateOneSimulation: mockMutateOneSimulation }]
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
    mockSimulation.mockReset()
    mockSimulation.mockImplementation(() => ({
      scheme: { configuration: { run: { done: true } } },
      tasks: [
        {
          type: 'mesh'
        },
        {
          type: 'simulation'
        }
      ]
    }))
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

  it('onLog', () => {
    wrapper.unmount()
    wrapper = mount(<Run project={project} simulation={simulation} />)

    // Mesh log
    wrapper
      .find('Step')
      .at(0)
      .props()
      .description.props.children[0].props.onClick()

    // Simulation log
    wrapper.find('Step').at(1).props().description.props.onClick()
  })

  it('setPart', () => {
    wrapper.unmount()
    wrapper = mount(<Run project={project} simulation={simulation} />)

    // Mesh part
    wrapper
      .find('Step')
      .at(0)
      .props()
      .description.props.children[1].props.onClick()
  })

  it('effect', () => {
    wrapper.unmount()

    // No tasks
    mockSimulation.mockImplementation(() => ({
      scheme: { configuration: { run: {} } },
      tasks: [
        {
          type: 'mesh',
          status: 'finish'
        },
        {
          type: 'simulation',
          status: 'finish'
        }
      ]
    }))
    wrapper = mount(<Run project={project} simulation={simulation} />)
    expect(wrapper).toBeDefined()

    // With tasks
    wrapper.unmount()
    mockSimulation.mockImplementation(() => ({
      scheme: { configuration: { run: {} } },
      tasks: [
        {
          type: 'mesh',
          status: 'finish'
        },
        {
          type: 'simulation',
          status: 'process'
        }
      ]
    }))
    wrapper = mount(<Run project={project} simulation={simulation} />)
    expect(wrapper).toBeDefined()
  })
})
