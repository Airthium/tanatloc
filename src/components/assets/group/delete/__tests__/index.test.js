import Delete from '..'
import { shallow } from 'enzyme'

jest.mock('@/components/assets/dialog', () => {
  const DeleteDialog = () => <div />
  return { DeleteDialog }
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockDel = jest.fn()
jest.mock('@/api/group', () => ({
  del: async () => mockDel()
}))

let wrapper
describe('components/administration/groups/delete', () => {
  const group = { id: 'id', name: 'name' }
  const swr = {
    reloadOrganizations: jest.fn(),
    delOneGroup: jest.fn()
  }

  beforeEach(() => {
    mockError.mockReset()

    mockDel.mockReset()

    wrapper = shallow(<Delete group={group} swr={swr} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('render', () => {
    expect(wrapper).toBeDefined()
  })

  test('setVisible', () => {
    // Visible
    wrapper.find('Button').props().onClick()

    // Not visible
    wrapper.find('DeleteDialog').props().onCancel()
  })

  test('onDelete', async () => {
    // Normal
    await wrapper.find('DeleteDialog').props().onOk()
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(swr.delOneGroup).toHaveBeenCalledTimes(1)
    expect(swr.reloadOrganizations).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockDel.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('DeleteDialog').props().onOk()
    expect(mockDel).toHaveBeenCalledTimes(2)
    expect(swr.delOneGroup).toHaveBeenCalledTimes(1)
    expect(swr.reloadOrganizations).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })
})
