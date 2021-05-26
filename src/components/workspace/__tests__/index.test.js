import Workspace from '..'
import { shallow, mount } from 'enzyme'

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

jest.mock('@/components/loading', () => ({
  Simple: () => <div />
}))

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

const mockProjects = jest.fn()
const mockAddOneProject = jest.fn()
const mockDelOneProject = jest.fn()
const mockMutateOneProject = jest.fn()
const mockErrorProjects = jest.fn()
const mockLoadingProjects = jest.fn()
jest.mock('@/api/project', () => ({
  useProjects: () => [
    mockProjects(),
    {
      addOneProject: mockAddOneProject,
      delOneProject: mockDelOneProject,
      mutateOneProject: mockMutateOneProject,
      errorProjects: mockErrorProjects(),
      loadingProjects: mockLoadingProjects()
    }
  ]
}))

let wrapper
describe('components/workspace', () => {
  const loading = false
  const user = { id: 'id' }
  const workspace = { id: 'id', projects: [] }
  const organizations = []
  const delOneWorkspace = jest.fn()
  const mutateOneWorkspace = jest.fn()
  const swr = { delOneWorkspace, mutateOneWorkspace }

  beforeEach(() => {
    mockError.mockReset()

    mockUserToAvatar.mockReset()
    mockGroupToAvatar.mockReset()

    mockUpdate.mockReset()

    mockProjects.mockReset()
    mockProjects.mockImplementation(() => [])
    mockAddOneProject.mockReset()
    mockDelOneProject.mockReset()
    mockMutateOneProject.mockReset()
    mockErrorProjects.mockReset()
    mockLoadingProjects.mockReset()

    wrapper = shallow(
      <Workspace
        loading={loading}
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

  it('loading', () => {
    wrapper.unmount()
    wrapper = shallow(
      <Workspace
        loading={true}
        user={user}
        workspace={workspace}
        organizations={organizations}
        swr={swr}
      />
    )
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
        loading={loading}
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
        loading={loading}
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

  // it('effect', () => {
  //   wrapper.unmount()
  //   wrapper = mount(
  //     <Workspace
  //       loading={loading}
  //       user={user}
  //       workspace={workspace}
  //       organizations={organizations}
  //       swr={swr}
  //     />
  //   )
  //   expect(wrapper).toBeDefined()

  //   // With error
  //   wrapper.unmount()
  //   mockErrorProjects.mockImplementation(() => ({ message: 'Error' }))
  //   wrapper = mount(
  //     <Workspace
  //       loading={loading}
  //       user={user}
  //       workspace={workspace}
  //       organizations={organizations}
  //       swr={swr}
  //     />
  //   )
  //   expect(mockError).toHaveBeenCalledTimes(1)
  // })

  it('propTypes', () => {
    let res
    const propTypes = Workspace.propTypes

    // User
    const userProps = propTypes.user
    res = userProps({ loading: true }, 'user', 'Workspace')
    expect(res).toBe()

    res = userProps({ loading: false }, 'user', 'Workspace')
    expect(res.message).toBe('Missing prop user supplied to Workspace.')

    res = userProps({ loading: false, user: {} }, 'user', 'Workspace')
    expect(res.message).toBe(
      'Invalid prop user supplied to Workspace. Missing id'
    )

    res = userProps({ loading: false, user: { id: {} } }, 'user', 'Workspace')
    expect(res.message).toBe(
      'Invalid prop user supplied to Workspace. Invalid id'
    )

    res = userProps({ loading: false, user: { id: 'id' } }, 'user', 'Workspace')
    expect(res).toBe()

    // Workspace
    const workspaceProps = propTypes.workspace
    res = workspaceProps({ loading: true }, 'workspace', 'Workspace')
    expect(res).toBe()

    res = workspaceProps({ loading: false }, 'workspace', 'Workspace')
    expect(res.message).toBe('Missing prop workspace supplied to Workspace.')

    res = workspaceProps(
      { loading: false, workspace: {} },
      'workspace',
      'Workspace'
    )
    expect(res.message).toBe(
      'Invalid prop workspace supplied to Workspace. Missing id'
    )

    res = workspaceProps(
      { loading: false, workspace: { id: {} } },
      'workspace',
      'Workspace'
    )
    expect(res.message).toBe(
      'Invalid prop workspace supplied to Workspace. Invalid id'
    )

    res = workspaceProps(
      { loading: false, workspace: { id: 'id' } },
      'workspace',
      'Workspace'
    )
    expect(res.message).toBe(
      'Invalid prop workspace supplied to Workspace. Missing projects'
    )

    res = workspaceProps(
      { loading: false, workspace: { id: 'id', projects: 'projects' } },
      'workspace',
      'Workspace'
    )
    expect(res.message).toBe(
      'Invalid prop workspace supplied to Workspace. Invalid projects'
    )

    res = workspaceProps(
      { loading: false, workspace: { id: 'id', projects: [] } },
      'workspace',
      'Workspace'
    )
    expect(res).toBe()
  })
})
