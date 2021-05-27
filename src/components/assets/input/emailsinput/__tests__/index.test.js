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

  test('render', () => {
    expect(wrapper).toBeDefined()
  })

  test('onChange', () => {
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

  test('onClose', () => {
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

  // test('effect', () => {
  //   // Without values
  //   wrapper.unmount()
  //   wrapper = mount(<EmailsInput onChange={onChange} />)

  //   // With values
  //   wrapper.unmount()
  //   wrapper = mount(<EmailsInput values={[]} onChange={onChange} />)
  // })
})
