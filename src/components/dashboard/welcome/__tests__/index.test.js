import Welcome from '@/components/dashboard/welcome'
import { shallow } from 'enzyme'

let wrapper
describe('components/dashboard/welcome', () => {
  beforeEach(() => {
    wrapper = shallow(<Welcome />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })
})
