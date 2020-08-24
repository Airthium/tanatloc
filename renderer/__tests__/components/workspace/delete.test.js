import Delete from '../../../components/workspace/delete'
import { shallow } from 'enzyme'

jest.mock('../../../../src/api/workspace', () => ({
  del: async () => {
    throw new Error('test')
  }
}))

let wrapper
describe('pages/workspace/delete', () => {
  beforeEach(() => {
    wrapper = shallow(<Delete />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('toggleConfirm', () => {
    const visible = wrapper.find('Modal').props().visible
    wrapper.find('Button').props().onClick()
    expect(wrapper.find('Modal').props().visible).toBe(!visible)
  })

  it('handleDelete', () => {
    wrapper.find('Modal').props().onOk()
  })
})
