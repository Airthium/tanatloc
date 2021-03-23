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
describe('components/organizations/organization/groups/delete', () => {
  const group = { id: 'id' }
  const delOneGroup = jest.fn()
  const reloadOrganizations = jest.fn()
  const swr = {
    delOneGroup,
    reloadOrganizations
  }

  beforeEach(() => {
    mockError.mockReset()

    mockDel.mockReset()

    wrapper = shallow(<Delete group={group} swr={swr} />)
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
    wrapper.find('DeleteDialog').props().onCancel()
  })

  it('onDelete', async () => {
    // Normal
    await wrapper.find('DeleteDialog').props().onOk()
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(delOneGroup).toHaveBeenCalledTimes(1)
    expect(reloadOrganizations).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockDel.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('DeleteDialog').props().onOk()
    expect(mockDel).toHaveBeenCalledTimes(2)
    expect(delOneGroup).toHaveBeenCalledTimes(1)
    expect(reloadOrganizations).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })
})
