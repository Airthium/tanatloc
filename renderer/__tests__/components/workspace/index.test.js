import Workspace from '../../../components/workspace'
import { shallow } from 'enzyme'

jest.mock('../../../components/workspace/add', () => 'add')

jest.mock('../../../components/project/list', () => 'list')

let wrapper
describe('components/workspace', () => {
  beforeEach(() => {
    wrapper = shallow(<Workspace />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('with users', () => {
    const users = ['id1', 'id2']
    wrapper.unmount()
    wrapper = shallow(<Workspace workspace={{ users: users }} />)

    expect(wrapper.find('Avatar').length).not.toBe(0)
  })
})
