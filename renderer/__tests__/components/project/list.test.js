import List from '../../../components/project/list'
import { shallow } from 'enzyme'

// jest.mock('../../../components/project/card', () => 'card')

let wrapper
describe('component/project/list', () => {
  beforeEach(() => {
    wrapper = shallow(<List />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })
})
