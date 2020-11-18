import Simulation from '../../../../components/project/simulation'
import { shallow, mount } from 'enzyme'

jest.mock('../../../../components/project/panel', () => 'panel')

jest.mock('../../../../components/project/simulation/about', () => 'about')
jest.mock(
  '../../../../components/project/simulation/geometry',
  () => 'geometry'
)
jest.mock(
  '../../../../components/project/simulation/parameters',
  () => 'parameters'
)
jest.mock(
  '../../../../components/project/simulation/boundaryConditions',
  () => 'boundaryConditions'
)

jest.mock('../../../../components/project/simulation/run', () => 'run')

jest.mock('../../../../../models', () => [
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

let wrapper
describe('components/project/simulation', () => {
  beforeEach(() => {
    wrapper = shallow(<Simulation />)
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

    wrapper.unmount()
    wrapper = mount(
      <Simulation
        simulation={{
          scheme: { categories: { geometry: { title: 'Geometry' } } }
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
    wrapper.find('Menu').props().onSelect({ key: 'algorithm' })
    const subWrapper = shallow(wrapper.find('Content').props().children)
    expect(subWrapper.html()).toEqual('<div>description</div>')
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
