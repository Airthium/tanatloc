import Dialog from '../../../../components/assets/dialog'
import { shallow } from 'enzyme'

jest.unmock('antd')
import antd from 'antd'

let wrapper
const mockResetFields = jest.fn()
const mockOnOk = jest.fn()
const mockOnCancel = jest.fn()
describe('renderer/components/assets/dialog', () => {
  beforeEach(() => {
    mockResetFields.mockReset()
    mockOnCancel.mockReset()
    mockOnOk.mockReset()
    antd.Form.useForm = () => [
      {
        validateFields: async () => {},
        resetFields: () => mockResetFields()
      }
    ]
    wrapper = shallow(
      <Dialog
        title="title"
        visible={false}
        onCancel={mockOnCancel}
        onOk={mockOnOk}
        loading={false}
      />
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onCancel', () => {
    wrapper.find('Modal').props().onCancel()
    expect(mockResetFields).toHaveBeenCalledTimes(1)
    expect(mockOnCancel).toHaveBeenCalledTimes(1)
  })

  it('onOk', async () => {
    // Normal
    await wrapper.find('Modal').props().onOk()
    expect(mockOnOk).toHaveBeenCalledTimes(1)
    expect(mockResetFields).toHaveBeenCalledTimes(1)

    // Error
    wrapper.unmount()
    antd.Form.useForm = () => [
      {
        validateFields: async () => {
          throw new Error()
        },
        resetFields: () => mockResetFields()
      }
    ]
    wrapper = shallow(
      <Dialog
        title="title"
        visible={false}
        onCancel={mockOnCancel}
        onOk={mockOnOk}
        loading={false}
      />
    )
    await wrapper.find('Modal').props().onOk()
  })
})
