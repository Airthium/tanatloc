import Delete from '@/components/project/delete'
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
jest.mock('@/api/project', () => ({
  del: async () => mockDel()
}))

let wrapper
describe('components/project/delete', () => {
  const workspace = { projects: [{ id: 'id' }] }
  const project = { id: 'id', title: 'title' }
  const mutateOneWorkspace = jest.fn()
  const delOneProject = jest.fn()
  const swr = { mutateOneWorkspace, delOneProject }

  beforeEach(() => {
    mockError.mockReset()

    mockDel.mockReset()

    wrapper = shallow(
      <Delete workspace={workspace} project={project} swr={swr} />
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
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mutateOneWorkspace).toHaveBeenCalledTimes(1)
    expect(delOneProject).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockDel.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('DeleteDialog').props().onOk()
    expect(mockDel).toHaveBeenCalledTimes(2)
    expect(mutateOneWorkspace).toHaveBeenCalledTimes(1)
    expect(delOneProject).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })
})
