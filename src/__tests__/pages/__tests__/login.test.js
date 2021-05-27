import Login from '@/pages/login'
import { shallow } from 'enzyme'

jest.mock('@/components/login', () => 'login')

let wrapper
describe('pages/login', () => {
  beforeEach(() => {
    wrapper = shallow(<Login />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('render', () => {
    expect(wrapper).toBeDefined()
  })
})
