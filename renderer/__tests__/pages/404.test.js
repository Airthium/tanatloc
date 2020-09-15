import NotFound from '../../pages/404'
import { shallow } from 'enzyme'

jest.mock('../../components/notfound', () => 'notfound')

let wrapper
describe('pages/404', () => {
  beforeEach(() => {
    wrapper = shallow(<NotFound />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })
})
