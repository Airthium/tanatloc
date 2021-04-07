import Plugin from '..'
import { shallow } from 'enzyme'

jest.mock('../dialog', () => {
  const PluginDialog = () => <div />
  return PluginDialog
})

jest.mock('../list', () => {
  const List = () => <div />
  return List
})

const mockPlugins = jest.fn()
const mockAddOnePlugin = jest.fn()
const mockDelOnePlugin = jest.fn()
const mockMutateOnePlugin = jest.fn()
const mockLoadingPlugins = jest.fn()
jest.mock('@/api/plugin', () => ({
  usePlugins: () => [
    mockPlugins(),
    {
      addOnePlugin: mockAddOnePlugin,
      delOnePlugin: mockDelOnePlugin,
      mutateOnePlugin: mockMutateOnePlugin,
      loadingPlugins: mockLoadingPlugins()
    }
  ]
}))

let wrapper
describe('component/account/hpc/plugin', () => {
  const plugin = { key: 'key' }

  beforeEach(() => {
    mockPlugins.mockReset()
    mockAddOnePlugin.mockReset()
    mockDelOnePlugin.mockReset()
    mockMutateOnePlugin.mockReset()
    mockLoadingPlugins.mockReset()

    wrapper = shallow(<Plugin plugin={plugin} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('loading', () => {
    wrapper.unmount()
    mockLoadingPlugins.mockImplementation(() => true)
    wrapper = shallow(<Plugin plugin={plugin} />)
    expect(wrapper.find('Spin').length).toBe(1)
  })
})
