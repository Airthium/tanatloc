import Add from '..'
import { shallow, mount } from 'enzyme'

jest.mock('@/components/assets/dialog', () => {
  const Dialog = () => <div />
  return Dialog
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockAdd = jest.fn()
jest.mock('@/api/group', () => ({
  add: async () => mockAdd()
}))

let wrapper
describe('components/organizations/organization/groups/add', () => {
  const organization = {}
  const addOneGroup = jest.fn()
  const reloadOrganizations = jest.fn()
  const swr = {
    addOneGroup,
    reloadOrganizations
  }

  beforeEach(() => {
    mockError.mockReset()

    mockAdd.mockReset()

    wrapper = shallow(<Add organization={organization} swr={swr} />)
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
    expect(addOneGroup).toHaveBeenCalledTimes(1)
    expect(reloadOrganizations).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('Dialog').props().onOk({})
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(addOneGroup).toHaveBeenCalledTimes(1)
    expect(reloadOrganizations).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })

  it('effect', () => {
    wrapper.unmount()
    wrapper = mount(<Add organization={organization} swr={swr} />)
    expect(wrapper).toBeDefined()

    wrapper.unmount()
    organization.owners = [{ firstname: 'firstname', lastname: 'lastname' }]
    organization.users = [{}]
    wrapper = mount(<Add organization={organization} swr={swr} />)
    expect(wrapper).toBeDefined()
  })
})
