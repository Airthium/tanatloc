import Simulation from '@/components/project/simulation'
import { shallow, mount } from 'enzyme'

const mockAddedDiff = jest.fn()
const mockUpdatedDiff = jest.fn()
jest.mock('deep-object-diff', () => ({
  addedDiff: () => mockAddedDiff(),
  updatedDiff: () => mockUpdatedDiff()
}))

const mockMerge = jest.fn()
jest.mock('lodash.merge', () => () => mockMerge())

jest.mock('@/components/project/panel', () => 'panel')

jest.mock('@/components/project/simulation/about', () => 'about')
jest.mock('@/components/project/simulation/geometry', () => 'geometry')
jest.mock('@/components/project/simulation/materials', () => 'materials')
jest.mock('@/components/project/simulation/parameters', () => 'parameters')
jest.mock(
  '@/components/project/simulation/boundaryConditions',
  () => 'boundaryConditions'
)

jest.mock('@/components/project/simulation/run', () => 'run')

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockMutate = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  useSimulations: () => [[], { mutateOneSimulation: mockMutate }],
  update: async () => mockUpdate()
}))

jest.mock('@/models', () => [
  {
    name: 'Name',
    algorithm: 'algorithm',
    description: 'description'
  },
  {
    name: 'Name2',
    algorithm: 'algorithm2',
    description: 'description2'
  }
])

jest.mock('@/plugins', () => ({
  hpc: {
    category: 'HPC'
  },
  model: {
    category: 'Model',
    models: [
      {
        name: 'name',
        algorithm: 'pluginAlgorithm',
        description: 'pluginDescription'
      }
    ]
  }
}))

let wrapper
describe('components/project/simulation', () => {
  beforeEach(() => {
    mockAddedDiff.mockReset()
    mockAddedDiff.mockImplementation(() => ({}))
    mockUpdatedDiff.mockReset()
    mockUpdatedDiff.mockImplementation(() => ({}))
    mockMerge.mockReset()
    mockMutate.mockReset()
    mockUpdate.mockReset()
    wrapper = shallow(<Simulation simulation={{}} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onClose', () => {
    const onClose = jest.fn()
    wrapper.unmount()
    wrapper = shallow(<Simulation onClose={onClose} />)
    wrapper.find('panel').props().onClose()
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('onUpdate', async () => {
    wrapper.unmount()
    wrapper = mount(
      <Simulation
        simulation={{
          scheme: {
            algorithm: 'algorithm',
            configuration: {
              geometry: { title: 'Geometry', file: {} }
            }
          }
        }}
        type="geometry"
      />
    )

    // Cancel
    wrapper.find('Modal').props().onCancel()

    // Normal
    await wrapper.find('Modal').props().onOk()
    expect(mockMerge).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockMutate).toHaveBeenCalledTimes(2)

    // Error
    mockMerge.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('Modal').props().onOk()
    expect(mockMerge).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockMutate).toHaveBeenCalledTimes(2)
  })

  it('about', () => {
    wrapper.unmount()
    wrapper = shallow(<Simulation type="about" />)
    expect(wrapper.find('about').length).toBe(1)
  })

  it('geometry', () => {
    wrapper.unmount()
    wrapper = shallow(<Simulation type="geometry" />)
    expect(wrapper.find('geometry').length).toBe(1)
  })

  it('materials', () => {
    wrapper.unmount()
    wrapper = shallow(<Simulation type="materials" />)
    expect(wrapper.find('materials').length).toBe(1)
  })

  it('parameters', () => {
    wrapper.unmount()
    wrapper = shallow(<Simulation type="parameters" />)
    expect(wrapper.find('parameters').length).toBe(1)
  })

  it('boundaryConditions', () => {
    wrapper.unmount()
    wrapper = shallow(<Simulation type="boundaryConditions" />)
    expect(wrapper.find('boundaryConditions').length).toBe(1)
  })

  it('run', () => {
    wrapper.unmount()
    wrapper = shallow(<Simulation type="run" />)
    expect(wrapper.find('run').length).toBe(1)
  })

  it('simulation effect', () => {
    wrapper.unmount()
    wrapper = mount(<Simulation />)
    expect(wrapper.find('panel').props().title).toBe('About')

    // No geometry
    wrapper.unmount()
    wrapper = mount(
      <Simulation
        simulation={{
          scheme: {
            algorithm: 'algorithm',
            configuration: {
              part: {},
              geometry: { title: 'Geometry', file: undefined },
              materials: { title: 'Materials' }
            }
          }
        }}
        type="material"
      />
    )
    expect(wrapper.find('panel').props().title).toBe('Materials')

    // Geometry
    wrapper.unmount()
    wrapper = mount(
      <Simulation
        simulation={{
          scheme: {
            algorithm: 'algorithm',
            configuration: {
              geometry: { title: 'Geometry', file: {} }
            }
          }
        }}
        type="geometry"
      />
    )
    expect(wrapper.find('panel').props().title).toBe('Geometry')

    // With changes
    wrapper.unmount()
    mockAddedDiff.mockImplementation(() => ({ something: { test: 'test' } }))
    wrapper = mount(
      <Simulation
        simulation={{
          scheme: {
            algorithm: 'algorithm',
            configuration: {
              geometry: { title: 'Geometry', file: {} }
            }
          }
        }}
        type="geometry"
      />
    )
    expect(wrapper.find('panel').props().title).toBe('Geometry')

    // Materials
    wrapper.unmount()
    wrapper = mount(
      <Simulation
        simulation={{
          scheme: {
            algorithm: 'algorithm',
            configuration: {
              materials: { title: 'Materials' }
            }
          }
        }}
        type="materials"
        part={{ type: 'result' }}
      />
    )
    expect(wrapper.find('panel').props().title).toBe('Materials')

    // Error
    wrapper.unmount()
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    wrapper = mount(
      <Simulation
        simulation={{
          scheme: {
            configuration: { geometry: { title: 'Geometry', file: {} } }
          }
        }}
        type="geometry"
      />
    )
    expect(wrapper.find('panel').props().title).toBe('Geometry')
  })
})

let onOk = jest.fn()
describe('components/project/simulation.Selector', () => {
  beforeEach(() => {
    onOk = jest.fn()
    wrapper = shallow(<Simulation.Selector onOk={onOk} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onSelect', () => {
    wrapper.unmount()
    wrapper = mount(<Simulation.Selector visible={true} onOk={onOk} />)

    wrapper.find('InternalMenu').props().onSelect({ key: 'algorithm' })
    wrapper.update()

    expect(wrapper.find('div').at(10).props().dangerouslySetInnerHTML).toEqual({
      __html: 'description'
    })
  })

  it('onCreate', async () => {
    await wrapper.find('Modal').props().onOk()

    // With current
    wrapper.find('Menu').props().onSelect({ key: 'algorithm' })
    await wrapper.find('Modal').props().onOk()
    expect(onOk).toHaveBeenCalledTimes(1)
  })

  it('effect', () => {
    wrapper.unmount()

    wrapper = mount(<Simulation.Selector />)
  })
})
