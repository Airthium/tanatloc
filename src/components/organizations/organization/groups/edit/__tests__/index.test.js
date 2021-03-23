import Edit from '..'
import { shallow, mount } from 'enzyme'

jest.mock('@/components/assets/dialog', () => {
  const Dialog = () => <div />
  return Dialog
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockUpdate = jest.fn()
jest.mock('@/api/group', () => ({
  update: async () => mockUpdate()
}))

let wrapper
describe('components/organizations/organization/groups/edit', () => {
  const group = {
    id: 'id',
    name: 'name',
    users: [{}]
  }
  const organization = {}
  const mutateOneGroup = jest.fn()
  const reloadOrganizations = jest.fn()
  const swr = {
    mutateOneGroup,
    reloadOrganizations
  }

  beforeEach(() => {
    mockError.mockReset()

    mockUpdate.mockReset()

    wrapper = shallow(
      <Edit group={group} organization={organization} swr={swr} />
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
    wrapper.find('Dialog').props().onCancel()
  })

  it('onUpdate', async () => {
    // Normal
    await wrapper
      .find('Dialog')
      .props()
      .onOk({ name: 'othername', users: ['id'] })
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mutateOneGroup).toHaveBeenCalledTimes(1)
    expect(reloadOrganizations).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // No modifications
    await wrapper.find('Dialog').props().onOk({ name: 'name', users: [] })
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mutateOneGroup).toHaveBeenCalledTimes(1)
    expect(reloadOrganizations).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('Dialog').props().onOk({ name: 'othername', users: [] })
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mutateOneGroup).toHaveBeenCalledTimes(1)
    expect(reloadOrganizations).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })

  it('effect', () => {
    wrapper.unmount()
    wrapper = mount(
      <Edit group={group} organization={organization} swr={swr} />
    )
    expect(wrapper).toBeDefined()

    wrapper.unmount()
    wrapper = mount(
      <Edit
        group={group}
        organization={{
          ...organization,
          users: [{ firstname: 'firstname', lastname: 'lastname' }],
          owners: [{}]
        }}
        swr={swr}
      />
    )
    expect(wrapper).toBeDefined()

    wrapper.unmount()
    wrapper = mount(
      <Edit
        group={{ id: 'id', name: 'name' }}
        organization={organization}
        swr={swr}
      />
    )
    expect(wrapper).toBeDefined()
  })
})
