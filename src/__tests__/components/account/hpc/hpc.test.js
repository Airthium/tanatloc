import HPC from '../../../../components/account/hpc'
import { mount } from 'enzyme'

jest.mock('../../../../components/account/hpc/plugin', () => 'Plugin')

jest.mock('../../../../plugin', () => ({
  NonHPCPlugin: {
    category: 'Other'
  },
  TestPlugin: {
    category: 'HPC',
    key: 'plugin',
    name: 'Test plugin'
  }
}))

const mockLoading = jest.fn()
jest.mock('../../../../../src/api/plugin', () => ({
  usePlugins: () => [[], { loadingPlugins: mockLoading() }]
}))

let wrapper
describe('renderer/components/account/hpc', () => {
  beforeEach(() => {
    mockLoading.mockReset()
    mockLoading.mockImplementation(() => false)

    wrapper = mount(<HPC />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('loading', () => {
    wrapper.unmount()
    mockLoading.mockImplementation(() => true)

    wrapper = mount(<HPC />)
    expect(wrapper.find('Spin').length).toBe(1)
  })
})
