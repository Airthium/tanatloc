import DeleteButton from '../../../../components/assets/button/delete'
import { shallow } from 'enzyme'

let wrapper
describe('renderer/components/assets/button/delete', () => {
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
  })
})
