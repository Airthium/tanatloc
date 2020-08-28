import Project from '../../../components/project'
import { shallow } from 'enzyme'

let wrapper
describe('components/project', () => {
  beforeEach(() => {
    wrapper = shallow(<Project />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })
})
