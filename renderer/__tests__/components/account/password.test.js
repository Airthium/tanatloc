import Password from '../../../components/account/password'
import { shallow } from 'enzyme'

let mockUpdate
let mockCheck
jest.mock('../../../../src/api/user', () => ({
  useUser: () => [{}, { mutateUser: () => {} }],
  update: () => mockUpdate(),
  check: () => mockCheck()
}))

let wrapper
describe('renderer/components/account/information', () => {
  beforeEach(() => {
    mockUpdate = jest.fn()
    mockCheck = jest.fn()
    wrapper = shallow(<Password />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onFinish', async () => {
    mockCheck = () => ({
      valid: true
    })

    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({
      newPassword: 'password',
      passwordConfirm: 'password'
    })
    expect(mockUpdate).toHaveBeenCalledTimes(1)

    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({
      newPassword: 'password',
      passwordConfirm: 'otherpassword'
    })
    expect(mockUpdate).toHaveBeenCalledTimes(1)

    mockCheck = () => ({
      valid: false
    })
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({
      newPassword: 'password',
      passwordConfirm: 'password'
    })
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })
})
