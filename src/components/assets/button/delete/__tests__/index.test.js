import DeleteButton from '@/components/assets/button/delete'
import { shallow } from 'enzyme'

jest.mock('@/components/assets/dialog', () => ({
  DeleteDialog: () => <div />
}))

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

  test('render', () => {
    expect(wrapper).toBeDefined()
    expect(wrapper.find('Button').props().loading).toBe(false)
  })

  test('setVisible', () => {
    wrapper.find('Button').props().onClick()

    wrapper.find('DeleteDialog').props().onCancel()
  })

  test('onDelete', () => {
    wrapper.find('DeleteDialog').props().onOk()
    expect(mockOnDelete).toHaveBeenCalledTimes(1)
  })
})
