import Dashboard from '@/pages/dashboard'
import { shallow } from 'enzyme'

jest.mock('@/components/dashboard', () => 'dashboard')

let wrapper
describe('pages/dashboard', () => {
  beforeEach(() => {
    wrapper = shallow(<Dashboard />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })
})
