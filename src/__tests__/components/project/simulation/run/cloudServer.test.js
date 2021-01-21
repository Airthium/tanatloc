import CloudServer from '@/components/project/simulation/run/cloudServer'
import { shallow } from 'enzyme'

jest.mock('@/plugin', () => ({
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
    mockPlugins.mockReset()
    mockPlugins.mockImplementation(() => [
      {
        key: 'key',
        uuid: 'uuid',
        name: 'name'
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

  it('setVisible', () => {
    wrapper.find('Button').props().onClick()
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
