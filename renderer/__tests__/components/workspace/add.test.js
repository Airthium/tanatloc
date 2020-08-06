import Add from '../../../components/workspace/add'
import { shallow } from 'enzyme'

let wrapper
describe('components/workspace/add', () => {
  beforeEach(() => {
    wrapper = shallow(<Add />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('toggleVisible', () => {
    const visible = wrapper.find('Modal').props().visible
    wrapper.find('Button').props().onClick()
    expect(wrapper.find('Modal').props().visible).toBe(!visible)
  })

  it('onOk', () => {
    wrapper.find('Modal').props().onOk()
  })

  it('onCancel', () => {
    const visible = wrapper.find('Modal').props().visible
    wrapper.find('Modal').props().onCancel()
    expect(wrapper.find('Modal').props().visible).toBe(!visible)
  })
})
