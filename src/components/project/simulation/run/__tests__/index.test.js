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

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
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
          label: 'Mesh',
          index: 1
        },
        {
          label: 'Simulation',
          index: -1,
          files: [{ name: 'name', fileName: 'resultFileName' }]
        },
        {
          label: 'Mesh2',
          index: 2
        }
      ]
    }))
    mockError.mockReset()
    wrapper = shallow(<Run project={project} simulation={simulation} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onRun', async () => {
    await wrapper.find('Button').at(0).props().onClick()
    expect(mockRun).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockRun.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('Button').at(0).props().onClick()
    expect(mockRun).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
  })

  it('onStop', async () => {
    wrapper.find('Button').at(1).props().onClick()
  })

  it('onCloudServer', async () => {
    // Normal
    await wrapper.find('CloudServer').props().onOk({})
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockMutateOneSimulation).toHaveBeenCalledTimes(1)
    expect(mockMutateSimulation).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('CloudServer').props().onOk({})
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockMutateOneSimulation).toHaveBeenCalledTimes(1)
    expect(mockMutateSimulation).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })

  it('onLog', () => {
    wrapper.unmount()
    wrapper = mount(<Run project={project} simulation={simulation} />)

    // Mesh log
    wrapper.find('Step').at(0).props().description.props.onClick()

    // Simulation log
    wrapper.find('Step').at(1).props().description.props.onClick()
  })

  it('setPart', () => {
    wrapper.unmount()
    wrapper = mount(<Run project={project} simulation={simulation} />)

    wrapper.find({ title: 'Results' }).find('Button').at(1).props().onClick()

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    wrapper.find({ title: 'Results' }).find('Button').at(1).props().onClick()
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
          label: 'Mesh',
          status: 'finish'
        },
        {
          label: 'Simulation',
          status: 'finish'
        }
      ]
    }))
    wrapper = mount(<Run project={project} simulation={simulation} />)
    expect(wrapper).toBeDefined()

    // With files
    wrapper.unmount()
    simulation.scheme.configuration.run.cloudServer = undefined
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

    wrapper.find('Step').at(0).props().description.props.onClick()

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

    wrapper.find('Step').at(0).props().description.props.onClick()

    wrapper.unmount()
    wrapper = mount(<Run project={project} simulation={simulation} />)
    expect(wrapper).toBeDefined()
    wrapper.find({ title: 'Results' }).find('Button').at(1).props().onClick()
  })
})
