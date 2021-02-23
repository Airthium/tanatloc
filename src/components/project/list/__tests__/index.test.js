import List from '@/components/project/list'
import { shallow } from 'enzyme'

jest.mock('next/router', () => ({
  useRouter: () => [{ push: () => {} }]
}))

jest.mock('@/components/project/data', () => (project, filter, title) => {
  return title
})

jest.mock('@/components/project/share', () => 'share')

jest.mock('@/components/project/delete', () => 'delete')

const mockProjects = jest.fn()
const mockMutate = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@/api/project', () => ({
  useProjects: () => [mockProjects(), { mutateOneProject: () => mockMutate() }],
  update: () => mockUpdate()
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

let wrapper
describe('component/project/list', () => {
  beforeEach(() => {
    mockProjects.mockReset()
    mockProjects.mockImplementation(() => [])
    mockMutate.mockReset()
    mockMutate.mockImplementation(() => {})
    mockUpdate.mockReset()

    wrapper = shallow(<List workspace={{}} filter={''} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('without props', () => {
    wrapper.unmount()
    wrapper = shallow(<List />)
    expect(wrapper).toBeDefined()
  })

  it('projects', () => {
    wrapper.unmount()
    mockProjects.mockImplementation(() => [{}, {}])
    wrapper = shallow(<List workspace={{}} />)

    const data = wrapper.find('Table').props().dataSource
    expect(data.length).toBe(2)

    data[0]()
    expect(mockUpdate).toHaveBeenCalledTimes(1)

    mockMutate.mockImplementation(() => {
      throw new Error()
    })
    data[0]()
    expect(mockUpdate).toHaveBeenCalledTimes(2)
  })

  it('onCell', () => {
    const func = wrapper.find('Column').at(0).props().onCell('record')
    func.onClick()
  })

  it('render', () => {
    // TODO must be at(5) if shared is enable
    const render = wrapper.find('Column').at(4).props().render()
    expect(shallow(render).html().includes('delete')).toBe(true)
  })
})
