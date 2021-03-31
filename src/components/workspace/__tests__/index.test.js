import Workspace from '..'
import { shallow } from 'enzyme'

jest.mock('@/components/assets/share', () => {
  const Share = () => <div />
  return Share
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('../delete', () => {
  const Delete = () => <div />
  return Delete
})

jest.mock('@/components/project/add', () => {
  const ProjectAdd = () => <div />
  return ProjectAdd
})

jest.mock('@/components/project/list', () => {
  const ProjectList = () => <div />
  return ProjectList
})

const mockUserToAvatar = jest.fn()
const mockGroupToAvatar = jest.fn()
jest.mock('@/lib/utils', () => ({
  userToAvatar: () => mockUserToAvatar(),
  groupToAvatar: () => mockGroupToAvatar()
}))

const mockUpdate = jest.fn()
jest.mock('@/api/workspace', () => ({
  update: async () => mockUpdate()
}))

let wrapper
describe('components/workspace', () => {
  const user = {}
  const workspace = { id: 'id' }
  const organizations = []
  const delOneWorkspace = jest.fn()
  const mutateOneWorkspace = jest.fn()
  const swr = { delOneWorkspace, mutateOneWorkspace }

  beforeEach(() => {
    mockError.mockReset()

    mockUserToAvatar.mockReset()
    mockGroupToAvatar.mockReset()

    mockUpdate.mockReset()

    wrapper = shallow(
      <Workspace
        user={user}
        workspace={workspace}
        organizations={organizations}
        swr={swr}
      />
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('setName', async () => {
    // Normal
    await wrapper.find('PageHeader').props().title.props.editable.onChange()
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mutateOneWorkspace).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('PageHeader').props().title.props.editable.onChange()
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mutateOneWorkspace).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })

  it('onSearch', () => {
    const input = wrapper.find('PageHeader').props().footer.props.children[1]
      .props.children[0]
    input.props.onChange({
      target: {
        value: 'filter'
      }
    })
  })

  it('owner', () => {
    wrapper.unmount()
    wrapper = shallow(
      <Workspace
        user={{ id: 'id' }}
        workspace={{
          ...workspace,
          owners: [{ id: 'id' }]
        }}
        organizations={organizations}
        swr={swr}
      />
    )
    expect(
      wrapper.find('PageHeader').props().extra.props.children[1]
    ).toBeDefined()
  })

  it('users & groups', () => {
    wrapper.unmount()
    wrapper = shallow(
      <Workspace
        user={user}
        workspace={{
          ...workspace,
          users: [{ id: 'id' }],
          groups: [{ id: 'id' }]
        }}
        organizations={organizations}
        swr={swr}
      />
    )
    expect(wrapper.find('.Workspace-share').length).toBe(1)
  })
})
