import Index from '@/pages/index'
import { shallow } from 'enzyme'

jest.mock('@/components/index/index', () => 'index')

let wrapper
describe('pages/index', () => {
  beforeEach(() => {
    wrapper = shallow(<Index />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('render', () => {
    expect(wrapper).toBeDefined()
  })
})
