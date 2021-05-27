import Project from '@/pages/project/[id]'
import { shallow } from 'enzyme'

jest.mock('@/components/project', () => 'project')

let wrapper
describe('pages/project', () => {
  beforeEach(() => {
    wrapper = shallow(<Project />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('render', () => {
    expect(wrapper).toBeDefined()
  })
})
