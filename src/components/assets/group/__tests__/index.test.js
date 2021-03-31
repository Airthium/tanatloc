import Group from '..'
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
const mockUpdate = jest.fn()
jest.mock('@/api/group', () => ({
  add: async () => mockAdd(),
  update: async () => mockUpdate()
}))

let wrapper
describe('components/assets/groups', () => {
  const userOptions = []
  const organization = {
    id: 'id'
  }
  const group = {
    id: 'id',
    name: 'name',
    users: [{}]
  }
  const swr = {
    reloadOrganizations: jest.fn(),
    addOneGroup: jest.fn(),
    mutateOneGroup: jest.fn()
  }

  beforeEach(() => {
    mockError.mockReset()

    swr.reloadOrganizations.mockReset()

    wrapper = shallow(
      <Group userOptions={userOptions} organization={organization} swr={swr} />
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

  it('onAdd', async () => {
    // Normal
    mockAdd.mockImplementation(() => ({}))
    await wrapper.find('Dialog').props().onOk({})
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(swr.addOneGroup).toHaveBeenCalledTimes(1)
    expect(swr.reloadOrganizations).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('Dialog').props().onOk({})
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(swr.addOneGroup).toHaveBeenCalledTimes(1)
    expect(swr.reloadOrganizations).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })

  it('edit', () => {
    wrapper.unmount()
    wrapper = shallow(
      <Group
        userOptions={userOptions}
        organization={organization}
        group={group}
        swr={swr}
      />
    )
    expect(wrapper).toBeDefined()
  })

  it('onEdit', async () => {
    wrapper.unmount()
    wrapper = shallow(
      <Group
        userOptions={userOptions}
        organization={organization}
        group={group}
        swr={swr}
      />
    )

    // Normal
    await wrapper
      .find('Dialog')
      .props()
      .onOk({
        name: 'otherName',
        users: [{}, {}]
      })
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(swr.mutateOneGroup).toHaveBeenCalledTimes(1)
    expect(swr.reloadOrganizations).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('Dialog').props().onOk(group)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(swr.mutateOneGroup).toHaveBeenCalledTimes(1)
    expect(swr.reloadOrganizations).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })
})
