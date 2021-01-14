import Plugin from '../../../../components/account/hpc/plugin'
import { shallow } from 'enzyme'

jest.mock('../../../../components/account/hpc/pluginForm', () => 'PluginForm')

jest.mock('../../../../components/account/hpc/list', () => 'List')

const mockPlugins = jest.fn()
const mockAddOnePlugin = jest.fn()
const mockAdd = jest.fn()
jest.mock('../../../../../src/api/plugin', () => ({
  usePlugins: () => [mockPlugins(), { addOnePlugin: mockAddOnePlugin }],
  add: () => mockAdd()
}))

const mockSentry = jest.fn()
jest.mock('../../../../../src/lib/sentry', () => ({
  captureException: () => mockSentry()
}))

let wrapper
describe('renderer/component/account/hpc/plugin', () => {
  const plugin = {
    logo: 'logo',
    configuration: {
      value: {}
    }
  }

  beforeEach(() => {
    mockPlugins.mockReset()
    mockPlugins.mockImplementation(() => [])
    mockAddOnePlugin.mockReset()
    mockAdd.mockReset()

    mockSentry.mockReset()

    wrapper = shallow(<Plugin plugin={plugin} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('add', () => {
    wrapper.find('Button').props().onClick()
    expect(wrapper.find('PluginForm').length).toBe(1)
  })

  it('onCancel', () => {
    wrapper.find('Button').props().onClick()

    wrapper.find('PluginForm').props().onCancel()
  })

  it('onFinish', async () => {
    wrapper.find('Button').props().onClick()

    await wrapper.find('PluginForm').props().onFinish({ value: 'value' })
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockAddOnePlugin).toHaveBeenCalledTimes(1)
    expect(mockSentry).toHaveBeenCalledTimes(0)

    // Error
    wrapper.find('Button').props().onClick()

    mockAdd.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('PluginForm').props().onFinish({ value: 'value' })
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockAddOnePlugin).toHaveBeenCalledTimes(1)
    expect(mockSentry).toHaveBeenCalledTimes(1)
  })
})
