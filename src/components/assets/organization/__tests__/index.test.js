import Organization from '..'
import { shallow } from 'enzyme'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('../users', () => {
  const Users = () => <div />
  return Users
})

jest.mock('../groups', () => {
  const Groups = () => <div />
  return Groups
})

const mockUpdate = jest.fn()
jest.mock('@/api/organization', () => ({
  update: async () => mockUpdate()
}))

let wrapper
describe('components/assets/organization', () => {
  const organization = { id: 'id', name: 'name', owners: [] }
  const swr = {
    reloadOrganizations: jest.fn(),
    mutateOneOrganization: jest.fn(),
    loadingOrganizations: false
  }
  const onClose = jest.fn()

  beforeEach(() => {
    mockError.mockReset()

    mockUpdate.mockReset()

    wrapper = shallow(
      <Organization organization={organization} swr={swr} onClose={onClose} />
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onName', async () => {
    // Normal
    await wrapper.find('Title').props().editable.onChange()
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(swr.mutateOneOrganization).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('Title').props().editable.onChange()
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(swr.mutateOneOrganization).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })
})
