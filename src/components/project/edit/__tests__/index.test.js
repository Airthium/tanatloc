import Add from '..'
import { shallow } from 'enzyme'

jest.mock('@/components/assets/dialog', () => {
  const Dialog = () => <div />
  return Dialog
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockAdd = jest.fn()
jest.mock('@/api/project', () => ({
  add: async () => mockAdd()
}))

let wrapper
describe('components/project/add', () => {
  const workspace = { id: 'id' }
  const mutateOneWorkspace = jest.fn()
  const addOneProject = jest.fn()
  const swr = {
    mutateOneWorkspace,
    addOneProject
  }

  beforeEach(() => {
    mockError.mockReset()

    mockAdd.mockReset()

    wrapper = shallow(<Add workspace={workspace} swr={swr} />)
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
    await wrapper.find('Dialog').props().onOk()
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(addOneProject).toHaveBeenCalledTimes(1)
    expect(mutateOneWorkspace).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('Dialog').props().onOk()
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(addOneProject).toHaveBeenCalledTimes(1)
    expect(mutateOneWorkspace).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })
})
