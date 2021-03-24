import Add from '..'
import { shallow } from 'enzyme'

jest.mock('@/components/assets/dialog', () => {
  const Dialog = () => <div />
  return Dialog
})

jest.mock('@/components/assets/input', () => {
  const PasswordItem = () => <div />
  return { PasswordItem }
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockAdd = jest.fn()
const mockUpdateById = jest.fn()
jest.mock('@/api/user', () => ({
  add: async () => mockAdd(),
  updateById: async () => mockUpdateById()
}))

let wrapper
describe('components/administration/users/add', () => {
  const addOneUser = jest.fn()
  const swr = { addOneUser }

  beforeEach(() => {
    mockError.mockReset()

    mockAdd.mockReset()
    mockUpdateById.mockReset()

    wrapper = shallow(<Add swr={swr} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('setVisible', () => {
    // Visible
    wrapper.find('Button').props().onClick()

    // Not visible
    wrapper.find('Dialog').props().onCancel()
  })

  it('onAdd', async () => {
    // Normal
    mockAdd.mockImplementation(() => ({}))
    await wrapper.find('Dialog').props().onOk({})
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockUpdateById).toHaveBeenCalledTimes(1)
    expect(addOneUser).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Already exists
    mockAdd.mockImplementation(() => ({ alreadyExists: true }))
    await wrapper.find('Dialog').props().onOk({})
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockUpdateById).toHaveBeenCalledTimes(1)
    expect(addOneUser).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('Dialog').props().onOk({})
    expect(mockAdd).toHaveBeenCalledTimes(3)
    expect(mockUpdateById).toHaveBeenCalledTimes(1)
    expect(addOneUser).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })
})
