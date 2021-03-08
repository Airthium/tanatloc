import HPC from '..'
import { mount } from 'enzyme'

jest.mock('@/components/account/hpc/plugin', () => 'Plugin')

jest.mock('@/plugins', () => ({
  NonHPCPlugin: {
    category: 'Other'
  },
  TestPlugin: {
    category: 'HPC',
    key: 'plugin',
    name: 'Test plugin'
  },
  TestUnauthorizedPlugin: {
    category: 'HPC',
    key: 'unauthorized',
    name: 'Unauthorized'
  }
}))

const mockUser = jest.fn()
jest.mock('@/api/user', () => ({
  useUser: () => [mockUser()]
}))

const mockLoading = jest.fn()
jest.mock('@/api/plugin', () => ({
  usePlugins: () => [[], { loadingPlugins: mockLoading() }]
}))

let wrapper
describe('src/components/account/hpc', () => {
  beforeEach(() => {
    mockUser.mockReset()
    mockUser.mockImplementation(() => ({
      authorizedplugins: ['plugin']
    }))

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

  it('without user', () => {
    wrapper.unmount()
    mockUser.mockImplementation(() => {})

    wrapper = mount(<HPC />)
    expect(wrapper).toBeDefined()
  })

  it('without authorized plugins', () => {
    wrapper.unmount()
    mockUser.mockImplementation(() => ({
      authorizedplugins: []
    }))

    wrapper = mount(<HPC />)
    expect(wrapper).toBeDefined()
  })
})
