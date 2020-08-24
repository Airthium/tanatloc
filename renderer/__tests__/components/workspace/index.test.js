import Workspace from '../../../components/workspace'
import { shallow } from 'enzyme'

jest.mock('../../../components/workspace/add', () => 'add')

jest.mock('../../../components/project/list', () => 'list')

jest.mock('../../../../src/api/workspace/useWorkspace', () => () => [
  [{}, { id: 'id1' }],
  { mutateWorkspace: jest.fn() }
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
    wrapper = shallow(<Workspace />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('setName', () => {
    // wrapper
    //   .find('PageHeader')
    //   .props()
    //   .title.props.children[1].props.children.props.editable.onChange()
    // wrapper
    //   .find('PageHeader')
    //   .props()
    //   .title.props.children[1].props.children.props.editable.onChange()
  })

  it('with users', () => {
    const users = ['id1', 'id2']
    wrapper.unmount()
    wrapper = shallow(<Workspace workspace={{ users: users }} />)

    expect(wrapper.find('Avatar').length).not.toBe(0)
  })
})
