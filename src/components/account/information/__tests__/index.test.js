import Information from '..'
import { shallow } from 'enzyme'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockUpdate = jest.fn()
jest.mock('@/api/user', () => ({
  update: () => mockUpdate()
}))

const mockAdd = jest.fn()
jest.mock('@/api/avatar', () => ({
  add: async () => mockAdd()
}))

global.FileReader = class {
  addEventListener(type, callback) {
    callback()
  }
  readAsDataURL() {}
}

let wrapper
describe('components/account/information', () => {
  const user = {}
  const mutateUser = jest.fn()
  const swr = {
    mutateUser
  }

  beforeEach(() => {
    mockError.mockReset()

    mockUpdate.mockReset()

    mockAdd.mockReset()

    wrapper = shallow(<Information user={user} swr={swr} />)
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
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({
      firstname: 'firstname',
      lastname: 'lastname',
      email: 'email'
    })
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
    expect(mockUpdate).toHaveBeenCalledTimes(3)
    expect(mockError).toHaveBeenCalledTimes(1)
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
    expect(mockError).toHaveBeenCalledTimes(0)

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
    expect(mockError).toHaveBeenCalledTimes(0)

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
    expect(mockError).toHaveBeenCalledTimes(1)
  })
})
