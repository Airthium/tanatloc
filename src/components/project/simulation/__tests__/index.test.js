import Simulation from '@/components/project/simulation'
import { shallow, mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

const mockAddedDiff = jest.fn()
const mockUpdatedDiff = jest.fn()
jest.mock('deep-object-diff', () => ({
  addedDiff: () => mockAddedDiff(),
  updatedDiff: () => mockUpdatedDiff()
}))

const mockMerge = jest.fn()
jest.mock('lodash.merge', () => () => mockMerge())

jest.mock('@/components/project/panel', () => {
  const Panel = () => <div />
  return Panel
})

jest.mock('@/components/project/simulation/about', () => {
  const About = () => <div />
  return About
})

jest.mock('@/components/project/simulation/geometry', () => {
  const Geometry = () => <div />
  return Geometry
})

jest.mock('@/components/project/simulation/materials', () => {
  const Materials = () => <div />
  return Materials
})

jest.mock('@/components/project/simulation/parameters', () => {
  const Parameters = () => <div />
  return Parameters
})

jest.mock('@/components/project/simulation/boundaryConditions', () => {
  const BoundaryConditions = () => <div />
  return BoundaryConditions
})

jest.mock('@/components/project/simulation/run', () => {
  const Run = () => <div />
  return Run
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
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
  const user = {}
  const simulation = {
    id: 'id'
  }
  const mutateOneSimulation = jest.fn()
  const swr = { mutateOneSimulation }
  const onClose = jest.fn()

  beforeEach(() => {
    mockAddedDiff.mockReset()
    mockAddedDiff.mockImplementation(() => ({}))
    mockUpdatedDiff.mockReset()
    mockUpdatedDiff.mockImplementation(() => ({}))

    mockMerge.mockReset()

    mockUpdate.mockReset()

    mockError.mockReset()

    wrapper = shallow(
      <Simulation
        user={user}
        simulation={simulation}
        swr={swr}
        onClose={onClose}
      />
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('render', () => {
    expect(wrapper).toBeDefined()
  })

  test('without simulation', () => {
    wrapper.unmount()
    wrapper = shallow(<Simulation user={user} swr={swr} onClose={onClose} />)
    expect(wrapper).toBeDefined()
  })

  test('onClose', () => {
    wrapper.unmount()
    wrapper = shallow(
      <Simulation
        user={user}
        simulation={simulation}
        swr={swr}
        onClose={onClose}
      />
    )
    wrapper.find('Panel').props().onClose()
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  // test('onUpdate', async () => {
  //   wrapper.unmount()
  //   wrapper = mount(
  //     <Simulation
  //       user={user}
  //       simulation={{
  //         ...simulation,
  //         scheme: {
  //           algorithm: 'algorithm',
  //           configuration: {
  //             geometry: { title: 'Geometry', file: {} }
  //           }
  //         }
  //       }}
  //       type="geometry"
  //       swr={swr}
  //       onClose={onClose}
  //     />
  //   )

  //   // Cancel
  //   act(() => wrapper.find('Modal').props().onCancel())

  //   // Normal
  //   await act(async () => await wrapper.find('Modal').props().onOk())
  //   expect(mockMerge).toHaveBeenCalledTimes(1)
  //   expect(mockUpdate).toHaveBeenCalledTimes(1)
  //   expect(mutateOneSimulation).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(0)

  //   // Error
  //   mockMerge.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   await act(async () => await wrapper.find('Modal').props().onOk())
  //   expect(mockMerge).toHaveBeenCalledTimes(2)
  //   expect(mockUpdate).toHaveBeenCalledTimes(1)
  //   expect(mutateOneSimulation).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(1)
  // })

  test('about', () => {
    wrapper.unmount()
    wrapper = shallow(
      <Simulation
        user={user}
        simulation={simulation}
        type="about"
        swr={swr}
        onClose={onClose}
      />
    )
    expect(wrapper.find('About').length).toBe(1)
  })

  test('geometry', () => {
    wrapper.unmount()
    wrapper = shallow(
      <Simulation
        user={user}
        simulation={simulation}
        type="geometry"
        swr={swr}
        onClose={onClose}
      />
    )
    expect(wrapper.find('Geometry').length).toBe(1)
  })

  test('materials', () => {
    wrapper.unmount()
    wrapper = shallow(
      <Simulation
        user={user}
        simulation={simulation}
        type="materials"
        swr={swr}
        onClose={onClose}
      />
    )
    expect(wrapper.find('Materials').length).toBe(1)
  })

  test('parameters', () => {
    wrapper.unmount()
    wrapper = shallow(
      <Simulation
        user={user}
        simulation={simulation}
        type="parameters"
        swr={swr}
        onClose={onClose}
      />
    )
    expect(wrapper.find('Parameters').length).toBe(1)
  })

  test('boundaryConditions', () => {
    wrapper.unmount()
    wrapper = shallow(
      <Simulation
        user={user}
        simulation={simulation}
        type="boundaryConditions"
        swr={swr}
        onClose={onClose}
      />
    )
    expect(wrapper.find('BoundaryConditions').length).toBe(1)
  })

  test('run', () => {
    wrapper.unmount()
    wrapper = shallow(
      <Simulation
        user={user}
        simulation={simulation}
        type="run"
        swr={swr}
        onClose={onClose}
      />
    )
    expect(wrapper.find('Run').length).toBe(1)
  })

  // test('simulation effect', () => {
  //   // Load models
  //   wrapper.unmount()
  //   wrapper = mount(
  //     <Simulation
  //       user={user}
  //       simulation={simulation}
  //       swr={swr}
  //       onClose={onClose}
  //     />
  //   )
  //   expect(wrapper.find('Panel').props().title).toBe('About')

  //   // Need update (added)
  //   wrapper.unmount()
  //   mockAddedDiff.mockImplementation(() => ({ something: { test: 'test' } }))
  //   wrapper = mount(
  //     <Simulation
  //       user={user}
  //       simulation={{
  //         ...simulation,
  //         scheme: {
  //           algorithm: 'algorithm',
  //           configuration: {
  //             geometry: { title: 'Geometry' }
  //           }
  //         }
  //       }}
  //       type="geometry"
  //       swr={swr}
  //       onClose={onClose}
  //     />
  //   )
  //   expect(wrapper.find('Panel').props().title).toBe('Geometry')
  //   mockAddedDiff.mockImplementation(() => ({}))
  // })
})

describe('components/project/simulation.Selector', () => {
  const user = {}
  const onOk = jest.fn()
  const onCancel = jest.fn()

  beforeEach(() => {
    onOk.mockReset()

    wrapper = shallow(
      <Simulation.Selector user={user} onOk={onOk} onCancel={onCancel} />
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('render', () => {
    expect(wrapper).toBeDefined()
  })

  // test('onSelect', () => {
  //   wrapper.unmount()
  //   wrapper = mount(
  //     <Simulation.Selector
  //       user={user}
  //       visible={true}
  //       onOk={onOk}
  //       onCancel={onCancel}
  //     />
  //   )

  //   act(() =>
  //     wrapper.find('InternalMenu').props().onSelect({ key: 'algorithm' })
  //   )
  //   wrapper.update()

  //   expect(wrapper.find('div').at(10).props().dangerouslySetInnerHTML).toEqual({
  //     __html: 'description'
  //   })
  // })

  test('onCreate', async () => {
    await wrapper.find('Modal').props().onOk()

    // With current
    wrapper.find('Menu').props().onSelect({ key: 'algorithm' })
    await wrapper.find('Modal').props().onOk()
    expect(onOk).toHaveBeenCalledTimes(1)
  })

  // test('effect', () => {
  //   wrapper.unmount()
  //   wrapper = mount(
  //     <Simulation.Selector user={user} onOk={onOk} onCancel={onCancel} />
  //   )
  //   expect(wrapper).toBeDefined()

  //   // With authorizedplugins
  //   wrapper.unmount()
  //   wrapper = mount(
  //     <Simulation.Selector
  //       user={{
  //         ...user,
  //         authorizedplugins: ['model']
  //       }}
  //       onOk={onOk}
  //       onCancel={onCancel}
  //     />
  //   )
  //   expect(wrapper).toBeDefined()
  // })
})
