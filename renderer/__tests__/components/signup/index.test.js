import Signup from '../../../components/signup'
import { shallow, mount } from 'enzyme'

jest.mock('../../../components/loading', () => 'loading')

const mockUser = jest.fn()
const mockLoading = jest.fn()
jest.mock('../../../../src/api/user', () => ({
  useUser: () => [mockUser(), { loadingUser: mockLoading() }]
}))

let wrapper
describe('renderer/components/signup', () => {
  beforeEach(() => {
    mockUser.mockReset()
    mockLoading.mockReset()
    wrapper = shallow(<Signup />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })
})
