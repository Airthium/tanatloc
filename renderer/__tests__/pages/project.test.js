import Project from '../../pages/project'
import { shallow } from 'enzyme'

jest.mock('../../components/project', () => 'project')

let wrapper
describe('pages/project', () => {
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
