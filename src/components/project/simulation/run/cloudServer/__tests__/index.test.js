import CloudServer from '@/components/project/simulation/run/cloudServer'
import { shallow } from 'enzyme'

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: () => mockPush()
  })
}))

jest.mock('@/plugins', () => ({
  key: {
    renderer: 'Renderer'
  }
}))

const mockPlugins = jest.fn()
jest.mock('@/api/plugin', () => ({
  usePlugins: () => [mockPlugins()]
}))

let wrapper
describe('src/components/project/simulation/run/cloudServer', () => {
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

    onOk.mockReset()

    wrapper = shallow(<CloudServer cloudServer={cloudServer} onOk={onOk} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('account', () => {
    wrapper.find('Button').at(0).props().onClick()
    expect(mockPush).toHaveBeenCalledTimes(1)
  })

  it('setVisible', () => {
    wrapper.find('Button').at(1).props().onClick()
    expect(wrapper.find('Modal').props().visible).toBe(true)
  })

  it('onMerge', () => {
    wrapper.find('Renderer').props().onSelect()
    expect(onOk).toHaveBeenCalledTimes(1)
  })

  it('onOk', () => {
    wrapper.find('Modal').props().onOk()
  })
})
