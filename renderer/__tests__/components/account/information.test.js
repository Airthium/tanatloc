import Information from '../../../components/account/information'
import { shallow } from 'enzyme'

const mockUpdate = jest.fn()
jest.mock('../../../../src/api/user', () => ({
  useUser: () => [
    {
      firstname: 'firstname',
      lastname: 'lastname',
      email: 'email',
      avatar: ['avatar']
    },
    { mutateUser: () => {} }
  ],
  update: () => mockUpdate()
}))

let mockAdd
jest.mock('../../../../src/api/avatar', () => ({
  add: async () => mockAdd()
}))

jest.mock('../../../../src/lib/sentry', () => ({
  captureException: () => {}
}))

global.FileReader = class {
  addEventListener(type, callback) {
    callback()
  }
  readAsDataURL() {}
}

let wrapper
describe('renderer/components/account/information', () => {
  beforeEach(() => {
    mockUpdate.mockReset()
    mockAdd = () => {}
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

    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
  })

  it('onCancel', () => {
    wrapper.find('Button').at(2).props().onClick()
  })

  it('beforeUpload', () => {
    let res

    res = wrapper
      .find('Upload')
      .props()
      .beforeUpload({ type: 'default', size: 5.1e7 })
    expect(res).toBe(false)

    res = wrapper
      .find('Upload')
      .props()
      .beforeUpload({ type: 'image/jpeg', size: 1024 })
    expect(res).toBe(true)
  })

  it('onChange', async () => {
    await wrapper
      .find('Upload')
      .props()
      .onChange({
        file: {
          status: 'uploading'
        }
      })

    await wrapper
      .find('Upload')
      .props()
      .onChange({
        file: {
          status: 'done',
          originFileObj: 'content'
        }
      })

    mockAdd = () => {
      throw new Error()
    }
    await wrapper
      .find('Upload')
      .props()
      .onChange({
        file: {
          status: 'done',
          originFileObj: 'content'
        }
      })
  })
})
