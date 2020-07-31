import Login from '../../../components/login'
import { shallow } from 'enzyme'

import '../../../../config/jest/matchMediaMock'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockRouter
  })
}))

let mockLogin = () => ({})
jest.mock('../../../../src/lib/api/user/login', () => {
  return async () => mockLogin()
})

let mockSelector = () => ({ user: {} })
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(() => jest.fn),
  useSelector: jest.fn((callback) => {
    callback({})
    return mockSelector()
  })
}))

jest.mock('../../../store/auth/action', () => ({
  login: jest.fn()
}))

describe('components/login', () => {
  it('render', () => {
    const wrapper = shallow(<Login />)
    expect(wrapper).toBeDefined()
    wrapper.unmount()
  })

  it('user', () => {
    mockSelector = () => ({
      user: {
        id: 'id'
      }
    })
    const wrapper = shallow(<Login />)
    expect(mockRouter).toHaveBeenCalledTimes(1)
    wrapper.unmount()

    mockSelector = () => ({
      user: {}
    })
  })

  it('onLogin', async () => {
    const wrapper = shallow(<Login />)

    mockRouter.mockReset()

    // non authorized
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
    expect(mockRouter).toHaveBeenCalledTimes(0)

    // authorized
    mockLogin = () => ({
      authorized: true
    })
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
    expect(mockRouter).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })
})
