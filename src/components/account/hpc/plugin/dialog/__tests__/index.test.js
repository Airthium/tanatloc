import PluginDialog from '..'
import { shallow, mount } from 'enzyme'

jest.mock('@/components/assets/dialog', () => {
  const Dialog = () => <div />
  return Dialog
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockAdd = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@/api/plugin', () => ({
  add: async () => mockAdd(),
  update: async () => mockUpdate()
}))

let wrapper
describe('components/account/hpc/dialog', () => {
  const plugin = {
    name: 'name',
    configuration: {
      input: {
        label: 'Input',
        type: 'input'
      },
      password: {
        label: 'Password',
        type: 'password'
      },
      select: {
        label: 'Select',
        type: 'select',
        options: ['option1', 'option2']
      },
      other: {
        label: 'Other',
        type: 'other'
      }
    }
  }
  const addOnePlugin = jest.fn()
  const mutateOnePlugin = jest.fn()
  const swr = {
    addOnePlugin,
    mutateOnePlugin
  }

  beforeEach(() => {
    mockError.mockReset()

    mockAdd.mockReset()
    mockUpdate.mockReset()

    wrapper = shallow(<PluginDialog plugin={plugin} swr={swr} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('render', () => {
    expect(wrapper).toBeDefined()
  })

  test('setVisible', () => {
    // Visible
    wrapper.find('Button').props().onClick()

    // Not visible
    wrapper.find('Dialog').props().onCancel()
  })

  test('onFinish', async () => {
    await wrapper
      .find('Dialog')
      .props()
      .onOk({ input: 'input', password: 'password', select: 'option1' })
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // With plugin items
    wrapper.unmount()
    wrapper = shallow(
      <PluginDialog
        plugin={{ ...plugin, logo: 'logo', renderer: 'renderer' }}
        swr={swr}
      />
    )
    await wrapper
      .find('Dialog')
      .props()
      .onOk({ input: 'input', password: 'password', select: 'option1' })
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error()
    })
    await wrapper
      .find('Dialog')
      .props()
      .onOk({ input: 'input', password: 'password', select: 'option1' })
    expect(mockAdd).toHaveBeenCalledTimes(3)
    expect(mockError).toHaveBeenCalledTimes(1)
  })

  test('edit', async () => {
    wrapper.unmount()

    wrapper = shallow(<PluginDialog plugin={plugin} swr={swr} edit={true} />)
    expect(wrapper).toBeDefined()

    await wrapper
      .find('Dialog')
      .props()
      .onOk({ input: 'input', password: 'password', select: 'option1' })
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
  })

  // test('effect', () => {
  //   wrapper.unmount()
  //   wrapper = mount(<PluginDialog plugin={plugin} swr={swr} />)
  // })
})
