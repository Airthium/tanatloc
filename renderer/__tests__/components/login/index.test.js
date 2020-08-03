import Login from '../../../components/login'
import { shallow, mount } from 'enzyme'

import '../../../../config/jest/matchMediaMock'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockRouter
  })
}))

let mockLogin = () => {}
jest.mock('../../../../src/api/login', () => {
  return async () => mockLogin()
})

let mockUser = () => {}
jest.mock('../../../../src/auth/useUser', () => ({
  useUser: () => [mockUser(), { mutate: jest.fn() }]
}))

let wrapper
describe('components/login', () => {
  beforeEach(() => {
    mockRouter.mockReset()
    wrapper = shallow(<Login />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onLogin', async () => {
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})

    mockLogin = () => ({})
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
    expect(mockRouter).toHaveBeenCalledTimes(1)
  })

  it('user', () => {
    // Use mount to launch useEffect()
    let mWrapper = mount(<Login />)
    expect(mockRouter).toHaveBeenCalledTimes(0)
    mWrapper.unmount()

    mockUser = () => ({})
    mWrapper = mount(<Login />)
    expect(mockRouter).toHaveBeenCalledTimes(1)
    mWrapper.unmount()
  })
})
