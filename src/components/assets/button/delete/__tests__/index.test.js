import DeleteButton from '@/components/assets/button/delete'
import { shallow } from 'enzyme'

let wrapper
describe('components/assets/button/delete', () => {
  const mockLoading = jest.fn(() => false)
  const mockOnDelete = jest.fn()

  beforeEach(() => {
    wrapper = shallow(
      <DeleteButton loading={mockLoading()} onDelete={mockOnDelete} />
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
    expect(wrapper.find('Button').props().loading).toBe(false)
  })

  it('onDelete', () => {
    wrapper.find('ForwardRef').props().onConfirm()
    expect(mockOnDelete).toHaveBeenCalledTimes(1)
  })
})
