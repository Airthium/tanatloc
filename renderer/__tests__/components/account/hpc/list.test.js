import List from '../../../../components/account/hpc/list'
import { shallow, mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

jest.mock('../../../../components/account/hpc/pluginForm', () => 'PluginForm')

jest.mock('../../../../components/account/hpc/delete', () => 'Delete')

const mockPlugins = jest.fn()
const mockMutateOnePlugin = jest.fn()
const mockUpdate = jest.fn()
jest.mock('../../../../../src/api/plugin', () => ({
  usePlugins: () => [mockPlugins(), { mutateOnePlugin: mockMutateOnePlugin }],
  update: () => mockUpdate()
}))

const mockSentry = jest.fn()
jest.mock('../../../../../src/lib/sentry', () => ({
  captureException: () => mockSentry()
}))

let wrapper
describe('renderer/components/account/hpc/list', () => {
  const plugin = { key: 'key' }

  beforeEach(() => {
    mockPlugins.mockReset()
    mockPlugins.mockImplementation(() => [])
    mockMutateOnePlugin.mockReset()
    mockUpdate.mockReset()

    mockSentry.mockReset()

    wrapper = shallow(<List plugin={plugin} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('with plugins', () => {
    wrapper.unmount()
    mockPlugins.mockImplementation(() => [
      {
        key: 'key',
        configuration: {
          name: 'name',
          item: {},
          password: { type: 'password' }
        }
      }
    ])

    wrapper = mount(<List plugin={plugin} />)
  })

  it('onEdit', async () => {
    wrapper.unmount()
    mockPlugins.mockImplementation(() => [
      { key: 'other' },
      { key: 'key', configuration: { name: 'name', item: {} } }
    ])

    wrapper = mount(<List plugin={plugin} />)

    act(() => wrapper.find('Button').props().onClick())
  })
})
