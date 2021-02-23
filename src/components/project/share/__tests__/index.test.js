import Share from '..'
import { shallow } from 'enzyme'

let wrapper
describe('src/components/project/share', () => {
  beforeEach(() => {
    wrapper = shallow(<Share />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })
})
