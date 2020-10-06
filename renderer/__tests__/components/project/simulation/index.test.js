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
    wrapper.find('Menu').props().onSelect({ key: 'selector key' })
    expect(wrapper.find('Content').props().children).toBe('selector key')
  })

  it('onCreate', async () => {
    await wrapper.find('Modal').props().onOk()

    // With current
    wrapper.find('Menu').props().onSelect({ key: 'selector key' })
    await wrapper.find('Modal').props().onOk()
    expect(onOk).toHaveBeenCalledTimes(1)
  })
})
