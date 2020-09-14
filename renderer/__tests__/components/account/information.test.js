import Information from '../../../components/account/information'
import { shallow } from 'enzyme'

let mockUpdate
jest.mock('../../../../src/api/user', () => ({
  useUser: () => [
    { firstname: 'firstname', lastname: 'lastname', email: 'email' },
    { mutateUser: () => {} }
  ],
  update: () => mockUpdate()
}))

let wrapper
describe('renderer/components/account/information', () => {
  beforeEach(() => {
    mockUpdate = jest.fn()
    wrapper = shallow(<Information />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onFinish', async () => {
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
    expect(mockUpdate).toHaveBeenCalledTimes(1)

    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({
      firstname: 'firstname',
      lastname: 'lastname',
      email: 'email'
    })
    expect(mockUpdate).toHaveBeenCalledTimes(2)

    mockUpdate = () => {
      throw new Error()
    }
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
  })

  it('onCancel', () => {
    wrapper.find('Button').at(0).props().onClick()
  })
})
