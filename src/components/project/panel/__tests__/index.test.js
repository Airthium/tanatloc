import Panel from '@/components/project/panel'
import { shallow } from 'enzyme'

let wrapper
describe('src/components/project/panel', () => {
  beforeEach(() => {
    wrapper = shallow(<Panel />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('visible', () => {
    wrapper.unmount()
    wrapper = shallow(<Panel visible={true} />)
    expect(wrapper.find('Card').props().style.display).toBe('block')
  })
})
