import Add from '../../../components/workspace/add'
import { shallow } from 'enzyme'

jest.unmock('antd')
import antd from 'antd'

jest.mock('../../../../src/api/workspace/add', () => {
  let count = 0
  return async () => {
    count++
    if (count === 1) throw new Error('test')
  }
})

let wrapper
describe('components/workspace/add', () => {
  beforeEach(() => {
    antd.Form.useForm = () => [
      {
        validateFields: async () => {},
        resetFields: () => {}
      }
    ]
    wrapper = shallow(<Add />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('toggleVisible', () => {
    const visible = wrapper.find('Modal').props().visible
    wrapper.find('Button').props().onClick()
    expect(wrapper.find('Modal').props().visible).toBe(!visible)
  })

  it('onOk', () => {
    wrapper.find('Modal').props().onOk()
    wrapper.find('Modal').props().onOk()

    antd.Form.useForm = () => [
      {
        validateFields: async () => {
          throw new Error()
        }
      }
    ]
    wrapper.find('Modal').props().onOk()
  })

  it('onCancel', () => {
    const visible = wrapper.find('Modal').props().visible
    wrapper.find('Modal').props().onCancel()
    expect(wrapper.find('Modal').props().visible).toBe(!visible)
  })
})
