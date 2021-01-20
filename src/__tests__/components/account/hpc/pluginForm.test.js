import PluginForm from '../../../../components/account/hpc/pluginForm'
import { shallow } from 'enzyme'

let wrapper
describe('renderer/components/account/hpc/pluginForm', () => {
  const plugin = {
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
  const mockFinish = jest.fn()
  const mockCancel = jest.fn()

  beforeEach(() => {
    mockFinish.mockReset()
    mockCancel.mockReset()
    wrapper = shallow(
      <PluginForm plugin={plugin} onFinish={mockFinish} onCancel={mockCancel} />
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onFinish', async () => {
    await wrapper
      .find('ForwardRef(InternalForm)')
      .props()
      .onFinish({ input: 'input', password: 'password', select: 'option1' })
    expect(mockFinish).toHaveBeenCalledTimes(1)

    // Error
    mockFinish.mockImplementation(() => {
      throw new Error()
    })
    await wrapper
      .find('ForwardRef(InternalForm)')
      .props()
      .onFinish({ input: 'input', password: 'password', select: 'option1' })
    expect(mockFinish).toHaveBeenCalledTimes(2)
  })
})
