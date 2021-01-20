import AddButton from '../../../../../components/assets/button/add'
import { shallow } from 'enzyme'

let wrapper
describe('renderer/components/assets/button/add', () => {
  const mockDisabled = jest.fn(() => false)
  const mockLoading = jest.fn(() => false)
  const mockOnAdd = jest.fn()

  beforeEach(() => {
    wrapper = shallow(
      <AddButton
        disabled={mockDisabled()}
        loading={mockLoading()}
        onAdd={mockOnAdd}
      />
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
    expect(wrapper.find('Button').props().disabled).toBe(false)
    expect(wrapper.find('Button').props().loading).toBe(false)
  })

  it('onAdd', () => {
    wrapper.find('Button').props().onClick()
    expect(mockOnAdd).toHaveBeenCalledTimes(1)
  })
})
