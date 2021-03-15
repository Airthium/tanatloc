import List from '../list'
import { shallow } from 'enzyme'
import React, { useEffect as mockUseEffect } from 'react'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn()
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('@/components/account/hpc/pluginForm', () => 'PluginForm')

jest.mock('@/components/account/hpc/delete', () => 'Delete')

const mockPlugins = jest.fn()
const mockMutateOnePlugin = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@/api/plugin', () => ({
  usePlugins: () => [mockPlugins(), { mutateOnePlugin: mockMutateOnePlugin }],
  update: () => mockUpdate()
}))

let wrapper
describe('components/account/hpc/list', () => {
  const plugin = { key: 'key' }

  beforeEach(() => {
    mockError.mockReset()

    mockPlugins.mockReset()
    mockPlugins.mockImplementation(() => [])
    mockMutateOnePlugin.mockReset()
    mockUpdate.mockReset()

    mockUseEffect.mockImplementationOnce((f) => f())
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

    mockUseEffect.mockImplementationOnce((f) => f())
    wrapper = shallow(<List plugin={plugin} />)
  })

  it('onEdit / onCancel', async () => {
    wrapper.unmount()
    mockPlugins.mockImplementation(() => [
      { uuid: 'uuid1', key: 'other' },
      { uuid: 'uuid2', key: 'key', configuration: { name: 'name', item: {} } }
    ])

    mockUseEffect.mockImplementationOnce((f) => f())
    wrapper = shallow(<List plugin={plugin} />)

    mockUseEffect.mockImplementationOnce((f) => f())
    wrapper.find('Button').props().onClick()

    // Normal
    await wrapper.find('PluginForm').props().onFinish({ item: 'value' })
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockMutateOnePlugin).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('PluginForm').props().onFinish({ item: 'value' })
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockMutateOnePlugin).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)

    // Cancel
    wrapper.find('PluginForm').props().onCancel()
  })
})
