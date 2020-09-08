import Workspace from '../../../components/workspace'
import { shallow } from 'enzyme'

jest.mock('../../../components/workspace/empty', () => 'empty')

jest.mock('../../../components/workspace/add', () => 'add')

jest.mock('../../../components/workspace/delete', () => 'delete')

jest.mock('../../../components/project/add', () => 'projectAdd')

jest.mock('../../../components/project/list', () => 'projectList')

jest.mock('../../../../src/api/workspace/useWorkspaces', () => () => [
  [{}, { id: 'id1' }],
  { mutateWorkspaces: jest.fn() }
])

jest.mock('../../../../src/api/workspace/update', () => {
  let count = 0
  return async () => {
    count++
    if (count === 1) throw new Error('test')
  }
})

let wrapper
describe('components/workspace', () => {
  beforeEach(() => {
    wrapper = shallow(<Workspace workspace={{}} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('setName', () => {
    wrapper.find('PageHeader').props().title.props.editable.onChange()
    wrapper.find('PageHeader').props().title.props.editable.onChange()
  })

  it('with users', () => {
    const users = ['id1', 'id2']
    wrapper.unmount()
    wrapper = shallow(<Workspace workspace={{ users: users }} />)

    expect(wrapper.find('Avatar').length).not.toBe(0)
  })

  it('empty', () => {
    wrapper.unmount()
    wrapper = shallow(<Workspace />)
    expect(wrapper.find('empty').length).toBe(1)
  })
})
