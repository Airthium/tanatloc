import DataBase from '../../../../../components/project/simulation/materials/database'
import { shallow } from 'enzyme'

let wrapper
describe('renderer/components/project/simulation/materials/database', () => {
  const mockOnSelect = jest.fn()

  beforeEach(() => {
    mockOnSelect.mockReset()
    wrapper = shallow(<DataBase onSelect={mockOnSelect} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('open/close', () => {
    expect(wrapper.find('Modal').props().visible).toBe(false)
    wrapper.find('Button').props().onClick()
    expect(wrapper.find('Modal').props().visible).toBe(true)
    wrapper.find('Modal').props().onCancel()
    expect(wrapper.find('Modal').props().visible).toBe(false)
  })

  it('menu', () => {
    wrapper.find('Menu').props().onClick({ key: 'metal' })
    expect(wrapper.find('List').length).toBe(1)

    wrapper.find('CollapsePanel').props().extra.props.onClick()
  })
})
