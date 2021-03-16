import Formula from '@/components/assets/formula'
import { shallow, mount } from 'enzyme'

const onValueChange = jest.fn()
const onCheckedChange = jest.fn()

global.setTimeout = (callback) => {
  callback()
  return 1
}

let wrapper
describe('components/assets/formula', () => {
  beforeEach(() => {
    onValueChange.mockReset()
    onCheckedChange.mockReset()

    wrapper = shallow(
      <Formula defaultValue="value" onValueChange={onValueChange} />
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('with checkbox', () => {
    wrapper.unmount()
    wrapper = shallow(
      <Formula
        defaultValue="value"
        defaultChecked={false}
        onValueChange={onValueChange}
        onCheckedChange={onCheckedChange}
      />
    )
    expect(wrapper).toBeDefined()

    expect(wrapper.find('Checkbox').length).toBe(1)
  })

  it('onCheckboxChange', () => {
    wrapper.unmount()
    wrapper = shallow(
      <Formula
        defaultValue="value"
        defaultChecked={true}
        onValueChange={onValueChange}
        onCheckedChange={onCheckedChange}
      />
    )

    let checked
    onCheckedChange.mockImplementation((val) => (checked = val))

    wrapper
      .find('Checkbox')
      .props()
      .onChange({
        target: {
          checked: true
        }
      })
    expect(onCheckedChange).toHaveBeenCalledTimes(1)
    expect(checked).toBe(true)
  })

  it('onInputChange', () => {
    let value
    onValueChange.mockImplementation((val) => (value = val))
    wrapper
      .find('Input')
      .props()
      .onChange({
        target: {
          value: 'newValue'
        }
      })
    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(value).toBe('newValue')

    wrapper
      .find('Input')
      .props()
      .onChange({
        target: {
          value: 'newValue'
        }
      })
  })

  it('effect', () => {
    wrapper.unmount()

    wrapper = mount(<Formula value="value" onChange={() => {}} />)
  })
})
