import Project from '../../../components/project'
import { shallow, mount } from 'enzyme'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
    push: () => {},
    replace: () => mockRouter()
  })
}))

jest.mock('../../../components/project/view', () => 'view')

let mockUser
jest.mock('../../../../src/api/user/useUser', () => () => [
  mockUser(),
  { loadingUser: false }
])

let wrapper
describe('components/project', () => {
  beforeEach(() => {
    mockRouter.mockReset()
    mockUser = () => ({ id: 'id' })
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

  it('user effect', () => {
    wrapper.unmount()

    // With user
    wrapper = mount(<Project />)
    expect(mockRouter).toHaveBeenCalledTimes(0)
    wrapper.unmount()

    // Without user
    mockUser = () => {}
    wrapper = mount(<Project />)
    expect(mockRouter).toHaveBeenCalledTimes(1)
  })
})
