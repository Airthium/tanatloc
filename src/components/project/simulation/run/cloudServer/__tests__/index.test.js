import CloudServer from '@/components/project/simulation/run/cloudServer'
import { shallow, mount } from 'enzyme'

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: () => mockPush()
  })
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('@/plugins', () => ({
  key: {
    renderer: 'Renderer'
  }
}))

const mockPlugins = jest.fn()
const mockErrorPlugins = jest.fn()
jest.mock('@/api/plugin', () => ({
  usePlugins: () => [mockPlugins(), { errorPlugins: mockErrorPlugins() }]
}))

let wrapper
describe('components/project/simulation/run/cloudServer', () => {
  const cloudServer = {
    inUseConfiguration: {
      item: {
        label: 'item',
        value: 'value'
      }
    }
  }
  const onOk = jest.fn()

  beforeEach(() => {
    mockPush.mockReset()

    mockError.mockReset()

    mockPlugins.mockReset()
    mockPlugins.mockImplementation(() => [
      {
        key: 'key',
        uuid: 'uuid',
        name: 'name',
        configuration: {
          name: {
            value: 'name'
          }
        }
      }
    ])
    mockErrorPlugins.mockReset()

    onOk.mockReset()

    wrapper = shallow(<CloudServer cloudServer={cloudServer} onOk={onOk} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('render', () => {
    expect(wrapper).toBeDefined()
  })

  test('account', () => {
    wrapper.find('Button').at(0).props().onClick()
    expect(mockPush).toHaveBeenCalledTimes(1)
  })

  test('setVisible', () => {
    wrapper.find('Button').at(1).props().onClick()
    expect(wrapper.find('Modal').props().visible).toBe(true)
  })

  test('onMerge', () => {
    wrapper.find('Renderer').props().onSelect()
    expect(onOk).toHaveBeenCalledTimes(1)
  })

  // test('effect', () => {
  //   wrapper.unmount()
  //   wrapper = mount(<CloudServer cloudServer={cloudServer} onOk={onOk} />)
  //   expect(wrapper).toBeDefined()

  //   // Error
  //   wrapper.unmount()
  //   mockErrorPlugins.mockImplementation(() => ({ message: 'Error' }))
  //   wrapper = mount(<CloudServer cloudServer={cloudServer} onOk={onOk} />)
  //   expect(mockError).toHaveBeenCalledTimes(1)
  // })
})
