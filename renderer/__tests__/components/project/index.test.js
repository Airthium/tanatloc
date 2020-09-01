import Project from '../../../components/project'
import { shallow } from 'enzyme'

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {}
  })
}))

jest.mock('../../../components/project/view', () => 'view')

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
