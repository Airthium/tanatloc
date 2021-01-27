import Information from '..'
import { shallow } from 'enzyme'

const mockUpdate = jest.fn()
const mockMutate = jest.fn()
jest.mock('@/api/user', () => ({
  useUser: () => [
    {
      firstname: 'firstname',
      lastname: 'lastname',
      email: 'email',
      avatar: ['avatar']
    },
    { mutateUser: mockMutate }
  ],
  update: () => mockUpdate()
}))

const mockAdd = jest.fn()
jest.mock('@/api/avatar', () => ({
  add: async () => mockAdd()
}))

const mockSentry = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: () => mockSentry()
}))

global.FileReader = class {
  addEventListener(type, callback) {
    callback()
  }
  readAsDataURL() {}
}

let wrapper
describe('src/components/account/information', () => {
  beforeEach(() => {
    mockUpdate.mockReset()
    mockMutate.mockReset()

    mockAdd.mockReset()

    mockSentry.mockReset()

    wrapper = shallow(<Information />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onFinish', async () => {
    // Normal
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
    expect(mockMutate).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockSentry).toHaveBeenCalledTimes(0)

    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({
      firstname: 'firstname',
      lastname: 'lastname',
      email: 'email'
    })
    expect(mockMutate).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockSentry).toHaveBeenCalledTimes(0)

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
    expect(mockMutate).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(3)
    expect(mockSentry).toHaveBeenCalledTimes(1)
  })

  it('onCancel', () => {
    wrapper.find('Button').at(2).props().onClick()
  })

  it('beforeUpload', () => {
    let res

    // Wrong
    res = wrapper
      .find('Upload')
      .props()
      .beforeUpload({ type: 'default', size: 5.1e7 })
    expect(res).toBe(false)

    // Good
    res = wrapper
      .find('Upload')
      .props()
      .beforeUpload({ type: 'image/jpeg', size: 1024 })
    expect(res).toBe(true)
  })

  it('onChange', async () => {
    // Uploading
    await wrapper
      .find('Upload')
      .props()
      .onChange({
        file: {
          status: 'uploading'
        }
      })
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockMutate).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(0)

    // Done
    await wrapper
      .find('Upload')
      .props()
      .onChange({
        file: {
          status: 'done',
          originFileObj: 'content'
        }
      })
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockMutate).toHaveBeenCalledTimes(1)
    expect(mockSentry).toHaveBeenCalledTimes(0)

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error()
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
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockMutate).toHaveBeenCalledTimes(1)
    expect(mockSentry).toHaveBeenCalledTimes(1)
  })
})
