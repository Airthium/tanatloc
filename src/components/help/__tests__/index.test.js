import Help from '@/components/help'
import { shallow } from 'enzyme'

let wrapper
describe('components/help', () => {
  beforeEach(() => {
    wrapper = shallow(<Help />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('render', () => {
    expect(wrapper).toBeDefined()
  })
})
