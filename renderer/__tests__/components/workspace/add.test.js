import Add from '../../../components/workspace/add'
import { shallow } from 'enzyme'

jest.unmock('antd')
import antd from 'antd'

jest.mock('../../../../src/api/workspace', () => {
  let count = 0
  return {
    add: async () => {
      count++
      if (count === 1) throw new Error('test')
      return { id: 'id' }
    },
    useWorkspaces: () => [[{}, { id: 'id1' }], { mutateWorkspaces: jest.fn() }]
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
  })

  it('onOk - validateFields', () => {
    wrapper.unmount()
    antd.Form.useForm = () => [
      {
        validateFields: async () => {
          throw new Error()
        }
      }
    ]
    wrapper = shallow(<Add />)
    wrapper.find('Modal').props().onOk()
  })

  it('onCancel', () => {
    const visible = wrapper.find('Modal').props().visible
    wrapper.find('Modal').props().onCancel()
    expect(wrapper.find('Modal').props().visible).toBe(!visible)
  })
})
