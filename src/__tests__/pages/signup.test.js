import Signup from '@/pages/signup'
import { shallow } from 'enzyme'

jest.mock('@/components/signup', () => 'signup')

let wrapper
describe('pages/signup', () => {
  beforeEach(() => {
    wrapper = shallow(<Signup />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })
})
