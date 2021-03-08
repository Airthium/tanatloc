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

const mockUser = jest.fn()
jest.mock('@/api/user', () => ({
  useUser: () => [mockUser()]
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
    key: 'model',
    models: [
      {
        name: 'name',
        algorithm: 'pluginAlgorithm',
        description: 'pluginDescription'
      }
    ]
  },
  unauthorizedModel: {
    category: 'Model',
    key: 'unauthorized'
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

    mockUser.mockReset()
    mockUser.mockImplementation(() => ({
      authorizedplugins: ['model']
    }))

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
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockMutate).toHaveBeenCalledTimes(1)

    // Error
    mockMerge.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('Modal').props().onOk()
    expect(mockMerge).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockMutate).toHaveBeenCalledTimes(1)
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
    // Load models
    wrapper.unmount()
    wrapper = mount(<Simulation />)
    expect(wrapper.find('panel').props().title).toBe('About')

    // Need update (added)
    wrapper.unmount()
    mockAddedDiff.mockImplementation(() => ({ something: { test: 'test' } }))
    wrapper = mount(
      <Simulation
        simulation={{
          scheme: {
            algorithm: 'algorithm',
            configuration: {
              geometry: { title: 'Geometry' }
            }
          }
        }}
        type="geometry"
      />
    )
    expect(wrapper.find('panel').props().title).toBe('Geometry')
    mockAddedDiff.mockImplementation(() => ({}))
  })
})

const onOk = jest.fn()
describe('components/project/simulation.Selector', () => {
  beforeEach(() => {
    onOk.mockReset()

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
