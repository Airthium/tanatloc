import Account from '../../../components/dashboard'
import { shallow } from 'enzyme'

let wrapper
describe('renderer/components/account', () => {
  beforeEach(() => {
    wrapper = shallow(<Account />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })
})
