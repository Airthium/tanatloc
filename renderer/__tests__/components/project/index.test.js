import Project from '../../../components/project'
import { shallow } from 'enzyme'

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
    push: () => {}
  })
}))

jest.mock('../../../components/project/view', () => 'view')

let wrapper
describe('components/project', () => {
  beforeEach(() => {
    wrapper = shallow(<Project />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('buttons', () => {
    wrapper.find('Button').forEach((button) => {
      button.props().onClick()
    })

    // One a simulation is added
    wrapper.find('Button').forEach((button) => {
      button.props().onClick()
    })
  })

  it('onClose', () => {
    wrapper.find('withConfigConsumer(Drawer)').props().onClose()
  })
})
