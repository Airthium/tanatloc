import Delete from '../../../components/project/delete'
import { shallow } from 'enzyme'

jest.mock('../../../components/assets/dialog', () => ({
  DeleteDialog: 'deleteDialog'
}))

jest.mock('../../../../src/api/project', () => ({
  useProjects: () => [[{ id: 'id' }], { mutateProjects: () => {} }],
  del: async () => {}
}))

let mockWorkspaces = () => [
  {
    id: 'id',
    prjects: []
  },
  {
    id: 'id2',
    projects: []
  }
]
jest.mock('../../../../src/api/workspace', () => ({
  useWorkspaces: () => [mockWorkspaces(), { mutateWorkspaces: () => {} }]
}))

let wrapper
describe('renderer/components/project/delete', () => {
  beforeEach(() => {
    mockWorkspaces = () => [
      {
        id: 'id',
        projects: []
      },
      {
        id: 'id2',
        projects: []
      }
    ]
    wrapper = shallow(
      <Delete workspace={{ id: 'id' }} project={{ id: 'id' }} />
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('toggleDialog', () => {
    const visible = wrapper.find('deleteDialog').props().visible
    wrapper.find('Button').props().onClick()
    expect(wrapper.find('deleteDialog').props().visible).toBe(!visible)
  })

  it('handleDelete', async () => {
    await wrapper.find('deleteDialog').props().onOk()
    expect(wrapper.find('deleteDialog').props().loading).toBe(true)

    wrapper.unmount()
    mockWorkspaces = () => [
      {
        id: 'id'
      }
    ]
    wrapper = shallow(
      <Delete workspace={{ id: 'id' }} project={{ id: 'id' }} />
    )
    await wrapper.find('deleteDialog').props().onOk()
    expect(wrapper.find('deleteDialog').props().loading).toBe(false)
  })
})
