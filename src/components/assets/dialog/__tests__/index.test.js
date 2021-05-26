import Dialog from '@/components/assets/dialog'
import { shallow, mount } from 'enzyme'

jest.mock('../delete')

jest.unmock('antd')
import antd from 'antd'

let wrapper
const mockResetFields = jest.fn()
const mockOnOk = jest.fn()
const mockOnCancel = jest.fn()
describe('components/assets/dialog', () => {
  beforeEach(() => {
    mockResetFields.mockReset()
    mockOnCancel.mockReset()
    mockOnOk.mockReset()
    antd.Form.useForm = () => [
      {
        name: 'name',
        getInternalHooks: () => ({
          dispatch: () => {},
          registerField: () => {},
          useSubscribe: () => {},
          setInitialValues: () => {},
          setCallbacks: () => {},
          setValidateMessages: () => {},
          getFields: () => {},
          setPreserve: () => {}
        }),
        resetFields: () => mockResetFields(),
        setFieldsValue: () => ({}),
        validateFields: async () => ({}),
        __INTERNAL__: {
          itemRef: () => {}
        }
      }
    ]
    wrapper = shallow(
      <Dialog
        title="title"
        visible={false}
        onCancel={mockOnCancel}
        onOk={mockOnOk}
        loading={false}
      >
        Test
      </Dialog>
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
      >
        Test
      </Dialog>
    )
    await wrapper.find('Modal').props().onOk()
  })

  // it('effect', () => {
  //   wrapper.unmount()
  //   wrapper = mount(
  //     <Dialog
  //       title="title"
  //       visible={false}
  //       onCancel={mockOnCancel}
  //       onOk={mockOnOk}
  //       loading={false}
  //     >
  //       Test
  //     </Dialog>
  //   )
  //   expect(wrapper).toBeDefined()

  //   wrapper.unmount()
  //   wrapper = mount(
  //     <Dialog
  //       title="title"
  //       visible={true}
  //       initialValues={{}}
  //       onCancel={mockOnCancel}
  //       onOk={mockOnOk}
  //       loading={false}
  //     >
  //       Test
  //     </Dialog>
  //   )
  //   expect(wrapper).toBeDefined()
  // })
})
