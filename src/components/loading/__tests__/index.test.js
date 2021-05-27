import Loading from '@/components/loading'
import { shallow } from 'enzyme'

jest.mock('@/components/background', () => 'background')

let wrapper
describe('components/loading', () => {
  beforeEach(() => {
    wrapper = shallow(<Loading />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('render', () => {
    expect(wrapper).toBeDefined()
  })
})
