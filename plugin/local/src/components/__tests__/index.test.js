import Local from '..'
import { shallow } from 'enzyme'

let wrapper
describe('plugin/local/src/component', () => {
  const onSelect = jest.fn()

  beforeEach(() => {
    onSelect.mockReset()

    wrapper = shallow(<Local onSelect={onSelect} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onClick', () => {
    wrapper.find('Button').props().onClick()
    expect(onSelect).toHaveBeenCalledTimes(1)
  })
})
