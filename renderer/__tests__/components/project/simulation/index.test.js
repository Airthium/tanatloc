import Simulation from '../../../../components/project/simulation'
import { shallow, mount } from 'enzyme'

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
    wrapper.find('withConfigConsumer(Drawer)').props().onClose()
  })

  it('mount', () => {
    const mWrapper = mount(<Simulation />)
    expect(mWrapper).toBeDefined()
    mWrapper.unmount()
  })

  it('mount with simulation', () => {
    const mWrapper = mount(<Simulation simulation={{ id: 'id' }} />)
    expect(mWrapper).toBeDefined()
    mWrapper.unmount()
  })
})
