import Formula from '../../../../components/assets/formula'
import { shallow, mount } from 'enzyme'

const onChange = jest.fn()

let wrapper
describe('renderer/components/assets/formula', () => {
  beforeEach(() => {
    onChange.mockReset()
    wrapper = shallow(<Formula value="value" onChange={onChange} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onChange', () => {
    let value
    onChange.mockImplementation((val) => (value = val))
    wrapper
      .find('Input')
      .props()
      .onChange({
        target: {
          value: 'newValue'
        }
      })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(value).toBe('newValue')
  })

  it('effect', () => {
    wrapper.unmount()

    wrapper = mount(<Formula value="value" onChange={() => {}} />)
  })
})
