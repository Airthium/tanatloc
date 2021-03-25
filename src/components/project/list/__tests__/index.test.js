import List from '..'
import { shallow } from 'enzyme'

jest.mock('next/router', () => ({
  useRouter: () => [{ push: () => {} }]
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockBuild = jest.fn()
jest.mock(
  '@/components/project/build',
  () => (project, filter, setTitle, setDescription) =>
    mockBuild(project, filter, setTitle, setDescription)
)

jest.mock('../../share', () => {
  const Share = () => <div />
  return Share
})

jest.mock('../../delete', () => {
  const Delete = () => <div />
  return Delete
})

const mockUpdate = jest.fn()
jest.mock('@/api/project', () => ({
  update: async () => mockUpdate()
}))

let wrapper
describe('component/project/list', () => {
  const user = { id: 'id' }
  const workspace = { id: 'id' }
  const filter = 'filter'
  const projects = [{}, {}]
  const delOneProject = jest.fn()
  const mutateOneProject = jest.fn()
  const loadingProjects = jest.fn()
  const swr = {
    delOneProject,
    mutateOneProject,
    loadingProjects
  }

  beforeEach(() => {
    mockError.mockReset()

    mockBuild.mockReset()

    mockUpdate.mockReset()

    // delOneProject.mockReset()
    mutateOneProject.mockReset()
    // loadingProjects.mockReset

    wrapper = shallow(
      <List
        user={user}
        workspace={workspace}
        filter={filter}
        projects={projects}
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

  it('setTitle', async () => {
    wrapper.unmount()
    mockBuild.mockImplementation((_, __, setTitle, ___) => ({
      setTitle
    }))
    wrapper = shallow(
      <List
        user={user}
        workspace={workspace}
        filter={filter}
        projects={projects}
        swr={swr}
      />
    )
    const data = wrapper.find('Table').props().dataSource

    // Normal
    await data[0].setTitle({}, 'title')
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mutateOneProject).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await data[0].setTitle({}, 'title')
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mutateOneProject).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })

  it('setDescription', async () => {
    wrapper.unmount()
    mockBuild.mockImplementation((_, __, ___, setDescription) => ({
      setDescription
    }))
    wrapper = shallow(
      <List
        user={user}
        workspace={workspace}
        filter={filter}
        projects={projects}
        swr={swr}
      />
    )
    const data = wrapper.find('Table').props().dataSource

    // Normal
    await data[0].setDescription({}, 'description')
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mutateOneProject).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await data[0].setDescription({}, 'description')
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mutateOneProject).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })

  it('columns', () => {
    const columns = wrapper.find('Table').props().columns

    // OpenProject
    columns[0].onCell({}).onClick()

    // Render
    columns[4].render({})
    columns[4].render({ owners: [{ id: 'id' }] })
  })
})
