import Delete from '../../../../components/account/hpc/delete'
import { shallow } from 'enzyme'

const mockPlugins = jest.fn()
const mockDelOnePlugin = jest.fn()
const mockUpdate = jest.fn()
jest.mock('../../../../../src/api/plugin', () => ({
  usePlugins: () => [mockPlugins(), { delOnePlugin: mockDelOnePlugin }],
  update: () => mockUpdate()
}))

const mockSentry = jest.fn()
jest.mock('../../../../../src/lib/sentry', () => ({
  captureException: () => mockSentry()
}))

let wrapper
describe('renderer/components/account/hpc/delete', () => {
  const plugin = { uuid: 'uuid' }

  beforeEach(() => {
    mockPlugins.mockReset()
    mockPlugins.mockImplementation(() => [])
    mockDelOnePlugin.mockReset()
    mockUpdate.mockReset()

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
    // Not found
    await wrapper.find('Button').props().onClick()
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelOnePlugin).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(1)

    // Normal
    wrapper.unmount()
    mockPlugins.mockImplementation(() => [{ uuid: 'uuid' }])
    wrapper = shallow(<Delete plugin={plugin} />)

    await wrapper.find('Button').props().onClick()
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockDelOnePlugin).toHaveBeenCalledTimes(1)
    expect(mockSentry).toHaveBeenCalledTimes(1)
  })
})
