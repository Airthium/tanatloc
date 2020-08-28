import Delete from '../../../components/project/delete'
import { shallow } from 'enzyme'

jest.mock('../../../components/assets/dialog', () => ({
  DeleteDialog: 'deleteDialog'
}))

jest.mock('../../../../src/api/project', () => ({
  useProjects: () => [[], { delOneProject: () => {} }],
  del: async () => {}
}))

jest.mock('../../../../src/api/workspace', () => ({
  useWorkspaces: () => [[], { mutateOneWorkspace: () => {} }]
}))

let wrapper
describe('renderer/components/project/delete', () => {
  beforeEach(() => {
    wrapper = shallow(
      <Delete workspace={{ id: 'id', projects: [{}] }} project={{ id: 'id' }} />
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('without props', () => {
    wrapper.unmount()
    wrapper = shallow(<Delete />)
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
    wrapper = shallow(
      <Delete workspace={{ id: 'id' }} project={{ id: 'id' }} />
    )
    await wrapper.find('deleteDialog').props().onOk()
    expect(wrapper.find('deleteDialog').props().loading).toBe(false)
  })
})
