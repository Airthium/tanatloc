import Login from '../../../components/login'
import { shallow, mount } from 'enzyme'

import '../../../../config/jest/matchMediaMock'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockRouter
  })
}))

jest.mock('../../../components/loading', () => 'loading')

let mockLogin = () => {}
jest.mock('..∕../../../src/api/login', () => async () => mockLogin())

let mockUser = () => {}
let mockUserLoading = () => false
jest.mock('../../../../src/api/user/useUser', () => () => [
  mockUser(),
  { mutateUser: () => {}, loadingUser: mockUserLoading() }
])

let wrapper
describe('components/login', () => {
  beforeEach(() => {
    mockRouter.mockReset()
    mockLogin = () => {}
    mockUser = () => {}
    mockUserLoading = () => false
    wrapper = shallow(<Login />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('loading', () => {
    wrapper.unmount()

    mockUserLoading = () => true
    wrapper = shallow(<Login />)
    expect(wrapper.find('loading').length).toBe(1)
  })

  it('user effect', () => {
    let mWrapper = mount(<Login />)
    expect(mockRouter).toHaveBeenCalledTimes(0)
    mWrapper.unmount()

    mockUser = () => ({ user: { id: 'id' } })
    mWrapper = mount(<Login />)
    expect(mockRouter).toHaveBeenCalledTimes(1)
    mWrapper.unmount()
  })

  it('onLogin', async () => {
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
    expect(mockRouter).toHaveBeenCalledTimes(0)

    mockLogin = () => ({})
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
    expect(mockRouter).toHaveBeenCalledTimes(1)
  })
})
