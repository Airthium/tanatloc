import List from '..'
import { shallow } from 'enzyme'

jest.mock('next/router', () => ({
  useRouter: () => [{ push: () => {} }]
}))

jest.mock('@/components/assets/share', () => {
  const Share = () => <div />
  return Share
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

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

    mockUpdate.mockReset()

    mutateOneProject.mockReset()

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
})
