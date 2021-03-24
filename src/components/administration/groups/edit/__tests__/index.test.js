import Edit from '..'
import { shallow } from 'enzyme'

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
describe('components/administration/groups/edit', () => {
  const group = { id: 'id', name: 'name', users: [{}] }
  const userOptions = []
  const mutateOneGroup = jest.fn()
  const swr = { mutateOneGroup }

  beforeEach(() => {
    mockError.mockReset()

    mockUpdate.mockReset()

    wrapper = shallow(
      <Edit group={group} userOptions={userOptions} swr={swr} />
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
      .onOk({
        name: 'new name',
        users: ['id']
      })
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mutateOneGroup).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('Dialog').props().onOk({
      name: 'name',
      users: []
    })
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mutateOneGroup).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })
})
