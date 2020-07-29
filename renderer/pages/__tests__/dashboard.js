import Dashboard from '../dashboard'
import { shallow } from 'enzyme'

jest.mock('../../components/project/list', () => 'list')

let wrapper
describe('<Dashbaord>', () => {
  beforeEach(() => {
    // wrapper = shallow(<Dashboard />)
  })

  afterEach(() => {
    // wrapper.unmount()
  })

  it('render', () => {
    // expect(wrapper).toBeDefined()
  })
})
