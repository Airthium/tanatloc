import List from '../../../components/project/list'
import { shallow } from 'enzyme'

jest.mock('next/router', () => ({
  useRouter: () => [{ push: () => {} }]
}))

jest.mock('../../../components/project/data', () => () => 'data')

jest.mock('../../../components/project/delete', () => 'delete')

let mockProjects = () => []
jest.mock('../../../../src/api/project', () => ({
  useProjects: () => [mockProjects()]
}))

let wrapper
describe('component/project/list', () => {
  beforeEach(() => {
    mockProjects = () => []
    wrapper = shallow(<List workspace={{}} />)
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
    mockProjects = () => [{}, {}]
    wrapper = shallow(<List workspace={{}} />)
    expect(wrapper.find('Table').props().dataSource).toEqual(['data', 'data'])
  })

  it('onCell', () => {
    const func = wrapper.find('Column').at(0).props().onCell('record')
    func.onClick()
  })

  it('render', () => {
    // TODO must be at(5) if shared is enable
    const render = wrapper.find('Column').at(4).props().render()
  })
})
