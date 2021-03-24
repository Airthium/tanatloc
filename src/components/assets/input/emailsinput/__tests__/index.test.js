import EmailsInput from '..'
import { shallow, mount } from 'enzyme'

let wrapper
describe('components/assets/input/emailsinput', () => {
  const onChange = jest.fn()

  beforeEach(() => {
    wrapper = shallow(<EmailsInput onChange={onChange} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onChange', () => {
    // Without email nor lastChar
    wrapper
      .find('Input')
      .props()
      .onChange({
        target: {
          value: 'value'
        }
      })
    expect(wrapper.find('Input').props().value).toBe('value')

    // Without email
    wrapper
      .find('Input')
      .props()
      .onChange({
        target: {
          value: 'value '
        }
      })
    expect(wrapper.find('Input').props().value).toBe('value ')

    // With emails
    wrapper
      .find('Input')
      .props()
      .onChange({
        target: {
          value: 'value mail@domain.com '
        }
      })
    expect(wrapper.find('Input').props().value).toBe('value ')
    expect(wrapper.find('Tag').length).toBe(1)
  })

  it('onClose', () => {
    // Add an email
    wrapper
      .find('Input')
      .props()
      .onChange({
        target: {
          value: 'mail@domain.com '
        }
      })

    // Close
    wrapper.find('Tag').props().onClose()
    expect(wrapper.find('Tag').length).toBe(0)
  })

  it('effect', () => {
    // Without values
    wrapper.unmount()
    wrapper = mount(<EmailsInput onChange={onChange} />)

    // With values
    wrapper.unmount()
    wrapper = mount(<EmailsInput values={[]} onChange={onChange} />)
  })
})
