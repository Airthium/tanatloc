import Error from '@/pages/_error'
import { shallow } from 'enzyme'

jest.mock('@/components/error', () => 'error')

let wrapper
describe('pages/_error', () => {
  beforeEach(() => {
    wrapper = shallow(<Error />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('render', () => {
    expect(wrapper).toBeDefined()
  })
})
