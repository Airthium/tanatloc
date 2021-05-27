import Administration from '../'
import { shallow } from 'enzyme'

let wrapper
describe('components/help/doc/administration', () => {
  beforeEach(() => {
    wrapper = shallow(<Administration />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('render', () => {
    expect(wrapper).toBeDefined()
  })
})
