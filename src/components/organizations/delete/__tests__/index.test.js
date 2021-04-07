import Delete from '..'
import { shallow } from 'enzyme'

jest.mock('@/components/assets/dialog', () => {
  const DeleteDialog = () => <div />
  return {
    DeleteDialog: DeleteDialog
  }
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockDel = jest.fn()
jest.mock('@/api/organization', () => ({
  del: async () => mockDel()
}))

let wrapper
describe('components/organizations/delete', () => {
  const organization = { id: 'id' }
  const delOneOrganization = jest.fn()
  const swr = {
    delOneOrganization
  }

  beforeEach(() => {
    mockError.mockReset()

    mockDel.mockReset()

    wrapper = shallow(<Delete organization={organization} swr={swr} />)
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
    expect(delOneOrganization).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockDel.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('DeleteDialog').props().onOk()
    expect(mockDel).toHaveBeenCalledTimes(2)
    expect(delOneOrganization).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })
})
