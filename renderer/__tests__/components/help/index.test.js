import Help from '../../../components/help'
import { shallow } from 'enzyme'

let wrapper
describe('renderer/components/help', () => {
  beforeEach(() => {
    wrapper = shallow(<Help />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })
})
