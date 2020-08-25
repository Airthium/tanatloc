import List from '../../../components/project/list'
import { shallow } from 'enzyme'

let mockProject = () => ({})
jest.mock('../../../../src/api/project', () => ({
  useProject: () => [mockProject()]
}))

let wrapper
describe('component/project/list', () => {
  beforeEach(() => {
    mockProject = () => {}
    wrapper = shallow(<List />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('projects', () => {
    wrapper.unmount()
    const projects = ['id']
    wrapper = shallow(<List projects={projects} />)

    wrapper.unmount()
    mockProject = () => ({
      avatar: 'avatar',
      owners: [{}],
      users: [{}]
    })
    wrapper = shallow(<List projects={projects} />)

    wrapper.unmount()
    mockProject = () => ({
      avatar: 'avatar',
      owners: [
        {
          firstname: 'firstname',
          lastname: 'lastname'
        }
      ],
      users: [
        {
          firstname: 'firstname',
          lastname: 'lastname'
        }
      ]
    })
    wrapper = shallow(<List projects={projects} />)
  })

  it('onCell', () => {
    const func = wrapper.find('Column').at(0).props().onCell('record')
    func.onClick()
  })

  it('render', () => {
    const render = wrapper.find('Column').at(5).props().render()
  })
})
