import Delete from '..'
import { shallow } from 'enzyme'

jest.mock('@/components/assets/dialog', () => {
  const DeleteDialog = () => <div />
  return {
    DeleteDialog
  }
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockUpdate = jest.fn()
jest.mock('@/api/organization', () => ({
  update: async () => mockUpdate()
}))

let wrapper
describe('componenets/assets/organization/users/delete', () => {
  const disabled = false
  const user = { id: 'id', email: 'email' }
  const organization = { id: 'id', users: [{ id: 'id' }] }
  const dBkey = 'users'
  const swr = {
    mutateOneOrganization: jest.fn()
  }

  beforeEach(() => {
    mockError.mockReset()

    mockUpdate.mockReset()

    wrapper = shallow(
      <Delete
        disabled={disabled}
        user={user}
        organization={organization}
        dBkey={dBkey}
        swr={swr}
      />
    )
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
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(swr.mutateOneOrganization).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('DeleteDialog').props().onOk()
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(swr.mutateOneOrganization).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })
})
