import Run from '@/components/project/simulation/run'
import { shallow, mount } from 'enzyme'

import '@/config/jest/matchMediaMock'

jest.mock(
  '@/components/project/simulation/run/cloudServer',
  () => 'CloudServer'
)

const mockRun = jest.fn()
const mockUpdate = jest.fn()
const mockSimulation = jest.fn()
const mockMutateSimulation = jest.fn()
const mockMutateOneSimulation = jest.fn()
jest.mock('@/api/simulation', () => ({
  run: async () => mockRun(),
  update: async () => mockUpdate(),
  useSimulation: () => [
    mockSimulation(),
    { mutateSimulation: mockMutateSimulation }
  ],
  useSimulations: () => [, { mutateOneSimulation: mockMutateOneSimulation }]
}))

const mockSentry = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: () => mockSentry()
}))

let wrapper
describe('src/components/project/simulation/run', () => {
  const project = {}
  const simulation = {
    scheme: {
      configuration: {
        about: {
          done: true
        },
        parameters: {
          done: false
        },
        run: {
          done: true
        }
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
          type: 'simulation',
          files: [{ name: 'name', fileName: 'resultFileName' }]
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

  it('onCloudServer', async () => {
    await wrapper.find('CloudServer').props().onOk({})
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

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    wrapper
      .find('Step')
      .at(0)
      .props()
      .description.props.children[1].props.onClick()

    // Simulation result
    wrapper.find({ title: 'Results' }).find('Button').props().onClick()
  })

  it('effect', () => {
    wrapper.unmount()

    // No file
    mockSimulation.mockImplementation(() => ({
      scheme: {
        configuration: {
          part: { fileName: 'fileName' },
          run: {}
        }
      },
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

    // With files
    wrapper.unmount()
    simulation.scheme.configuration.run.cloudServer = {}
    mockSimulation.mockImplementation(() => ({
      scheme: {
        configuration: { run: { done: true } }
      },
      tasks: [
        {
          type: 'mesh',
          status: 'finish',
          file: {
            fileName: 'fileName'
          }
        },
        {
          type: 'simulation',
          status: 'process',
          files: [
            {
              name: 'name',
              fileName: 'fileName'
            }
          ]
        }
      ]
    }))
    wrapper = mount(<Run project={project} simulation={simulation} />)
    expect(wrapper).toBeDefined()

    wrapper
      .find('Step')
      .at(0)
      .props()
      .description.props.children[1].props.onClick()

    wrapper.unmount()
    mockSimulation.mockImplementation(() => ({
      scheme: {
        configuration: {
          part: { name: 'name', fileName: 'fileName' },
          run: { done: true }
        }
      },
      tasks: [
        {
          type: 'mesh',
          status: 'finish',
          file: {
            fileName: 'fileName'
          }
        },
        {
          type: 'simulation',
          status: 'process',
          files: [
            {
              name: 'name',
              fileName: 'fileName'
            }
          ]
        }
      ]
    }))
    wrapper = mount(<Run project={project} simulation={simulation} />)
    expect(wrapper).toBeDefined()

    wrapper
      .find('Step')
      .at(0)
      .props()
      .description.props.children[1].props.onClick()

    wrapper.unmount()
    wrapper = mount(<Run project={project} simulation={simulation} />)
    expect(wrapper).toBeDefined()
    wrapper.find({ title: 'Results' }).find('Button').props().onClick()
  })
})
