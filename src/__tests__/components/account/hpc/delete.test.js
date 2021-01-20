import Delete from '@/components/account/hpc/delete'
import { shallow } from 'enzyme'

const mockPlugins = jest.fn()
const mockDelOnePlugin = jest.fn()
const mockDelete = jest.fn()
jest.mock('@/api/plugin', () => ({
  usePlugins: () => [mockPlugins(), { delOnePlugin: mockDelOnePlugin }],
  del: () => mockDelete()
}))

const mockSentry = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: () => mockSentry()
}))

let wrapper
describe('src/components/account/hpc/delete', () => {
  const plugin = { uuid: 'uuid' }

  beforeEach(() => {
    mockPlugins.mockReset()
    mockPlugins.mockImplementation(() => [])
    mockDelOnePlugin.mockReset()
    mockDelete.mockReset()

    mockSentry.mockReset()

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
    expect(mockSentry).toHaveBeenCalledTimes(0)

    // Error
    mockDelete.mockImplementation(() => {
      throw new Error()
    })

    await wrapper.find('Button').props().onClick()
    expect(mockDelete).toHaveBeenCalledTimes(2)
    expect(mockDelOnePlugin).toHaveBeenCalledTimes(1)
    expect(mockSentry).toHaveBeenCalledTimes(1)
  })
})
