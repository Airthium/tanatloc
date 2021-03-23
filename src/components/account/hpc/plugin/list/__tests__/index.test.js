import List from '..'
import { shallow, mount } from 'enzyme'

jest.mock('../../dialog', () => {
  const PluginDialog = () => <div />
  return PluginDialog
})

jest.mock('../../delete', () => {
  const Delete = () => <div />
  return Delete
})

let wrapper
describe('components/account/hpc/list', () => {
  const plugin = { key: 'key' }
  const plugins = [{}]
  const addOnePlugin = jest.fn()
  const delOnePlugin = jest.fn()
  const mutateOnePlugin = jest.fn()
  const swr = {
    addOnePlugin,
    delOnePlugin,
    mutateOnePlugin
  }

  beforeEach(() => {
    wrapper = shallow(<List plugin={plugin} plugins={plugins} swr={swr} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('mount', () => {
    wrapper.unmount()
    wrapper = mount(<List plugin={plugin} plugins={plugins} swr={swr} />)
    expect(wrapper).toBeDefined()
  })
})
