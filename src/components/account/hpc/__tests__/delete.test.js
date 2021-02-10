import Delete from '../delete'
import { shallow } from 'enzyme'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockPlugins = jest.fn()
const mockDelOnePlugin = jest.fn()
const mockDelete = jest.fn()
jest.mock('@/api/plugin', () => ({
  usePlugins: () => [mockPlugins(), { delOnePlugin: mockDelOnePlugin }],
  del: () => mockDelete()
}))

let wrapper
describe('src/components/account/hpc/delete', () => {
  const plugin = { uuid: 'uuid' }

  beforeEach(() => {
    mockError.mockReset()

    mockPlugins.mockReset()
    mockPlugins.mockImplementation(() => [])
    mockDelOnePlugin.mockReset()
    mockDelete.mockReset()

    wrapper = shallow(<Delete plugin={plugin} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onDelete', async () => {
    // Normal
    await wrapper.find('Button').props().onClick()
    expect(mockDelete).toHaveBeenCalledTimes(1)
    expect(mockDelOnePlugin).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockDelete.mockImplementation(() => {
      throw new Error()
    })

    await wrapper.find('Button').props().onClick()
    expect(mockDelete).toHaveBeenCalledTimes(2)
    expect(mockDelOnePlugin).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })
})
