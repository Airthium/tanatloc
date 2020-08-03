import Login from '../../../components/login'
import { shallow } from 'enzyme'

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

jest.mock('../../../../src/auth/useUser', () => ({
  useUser: () => [{}, { mutate: jest.fn() }]
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
    // TODO useEffect
  })
})
