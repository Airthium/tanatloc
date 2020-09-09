import Account from '../../../components/account'
import { shallow } from 'enzyme'

jest.mock('../../../components/account/delete', () => 'delete')

let mockMutateUser
jest.mock('../../../../src/api/user', () => ({
  useUser: () => [
    { firstname: 'firstname', lastname: 'lastname', email: 'email' },
    { mutateUser: () => mockMutateUser() }
  ],
  update: async () => {}
}))

let wrapper
describe('renderer/components/account', () => {
  beforeEach(() => {
    wrapper = shallow(<Account />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onFinish', () => {
    wrapper.find({ name: 'personalForm' }).props().onFinish({})
    wrapper.find({ name: 'personalForm' }).props().onFinish({
      firstname: 'firstname',
      lastname: 'lastname',
      email: 'email'
    })
  })

  it('onCancel', () => {
    const form = wrapper.find({ name: 'personalForm' })
    form.find('Button').at(0).props().onClick()
  })

  it('onPasswordFinish', () => {
    wrapper
      .find({ name: 'passwordForm' })
      .props()
      .onFinish({ newPassword: 'password', passwordConfirm: 'password' })
    wrapper
      .find({ name: 'passwordForm' })
      .props()
      .onFinish({ newPassword: 'password', passwordConfirm: 'otherpassword' })
  })
})
