import EditButton from '../../../../../components/assets/button/edit'
import { shallow } from 'enzyme'

let wrapper
describe('renderer/components/assets/button/add', () => {
  const mockDisabled = jest.fn(() => false)
  const mockLoading = jest.fn(() => false)
  const mockOnEdit = jest.fn()

  beforeEach(() => {
    wrapper = shallow(
      <EditButton
        disabled={mockDisabled()}
        loading={mockLoading()}
        onEdit={mockOnEdit}
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

  it('onEdit', () => {
    wrapper.find('Button').props().onClick()
    expect(mockOnEdit).toHaveBeenCalledTimes(1)
  })
})
