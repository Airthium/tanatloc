import Rescale from '..'
import { shallow, mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import '@/config/jest/matchMediaMock'

let wrapper
describe('plugin/rescale/src/components/index', () => {
  const data = {
    coreTypes: [
      {
        name: 'name',
        cores: [1, 2, 4],
        memory: 5000,
        price: 5000,
        lowPriorityPrice: 1000
      }
    ],
    freefem: {
      versions: [{}]
    }
  }
  const onSelect = jest.fn()

  beforeEach(() => {
    onSelect.mockReset()

    wrapper = shallow(<Rescale data={data} onSelect={onSelect} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onRowChange', () => {
    wrapper.find('Table').props().rowSelection.onChange('key', [{}])
  })

  it('onOk', () => {
    // Step 1
    wrapper
      .find('Table')
      .props()
      .rowSelection.onChange('key', [{ fullCores: [] }])
    wrapper.find('Modal').props().onOk()

    // Step 2
    wrapper.find('Modal').props().onOk()
  })

  it('onCancel', () => {
    wrapper.find('Modal').props().onCancel()
  })

  it('getCheckboxProps', () => {
    wrapper.find('Table').props().rowSelection.getCheckboxProps({})
  })

  it('setLowPriority', () => {
    // Got to step 2
    wrapper
      .find('Table')
      .props()
      .rowSelection.onChange('key', [{ fullCores: [] }])
    wrapper.find('Modal').props().onOk()

    wrapper
      .find('Radio')
      .at(0)
      .parent()
      .props()
      .onChange({ target: { value: true } })
  })

  it('onCoresChange', () => {
    // Got to step 2
    wrapper
      .find('Table')
      .props()
      .rowSelection.onChange('key', [{ fullCores: [1, 2, 4] }])
    wrapper.find('Modal').props().onOk()

    // Wrong
    wrapper.find('ForwardRef').props().onChange(3)
    expect(wrapper.find('ForwardRef').props().style).toEqual({
      border: '1px solid red'
    })

    // Good
    wrapper.find('ForwardRef').props().onChange(4)
    expect(wrapper.find('ForwardRef').props().style).not.toEqual({
      border: '1px solid red'
    })
  })

  it('onCoresStep', () => {
    // Got to step 2
    wrapper
      .find('Table')
      .props()
      .rowSelection.onChange('key', [{ fullCores: [1, 2, 4] }])
    wrapper.find('Modal').props().onOk()

    // Up
    wrapper.find('ForwardRef').props().onStep(2, { type: 'up' })
    wrapper.find('ForwardRef').props().onStep(8, { type: 'up' })

    // Down
    wrapper.find('ForwardRef').props().onStep(2, { type: 'down' })
    wrapper.find('ForwardRef').props().onStep(0, { type: 'down' })
  })

  it('onVersionChange', () => {
    // Got to step 2
    wrapper
      .find('Table')
      .props()
      .rowSelection.onChange('key', [{ fullCores: [1, 2, 4] }])
    wrapper.find('Modal').props().onOk()

    wrapper.find('ForwardRef(InternalSelect)').props().onChange()
  })

  it('setVisible', () => {
    wrapper.find('Button').props().onClick()
    expect(wrapper.find('Modal').props().visible).toBe(true)
  })

  it('render', () => {
    wrapper.find('Table').props().columns[0].render('text', {})
    wrapper.find('Table').props().columns[1].render([1, 2, 3])
    wrapper.find('Table').props().columns[2].render(5000)
  })

  it('useEffect', () => {
    wrapper.unmount()

    wrapper = mount(<Rescale data={data} onSelect={onSelect} />)

    // Open
    act(wrapper.find('Button').props().onClick)
    wrapper.update()

    // Set selection
    act(() =>
      wrapper
        .find('Table')
        .at(0)
        .props()
        .rowSelection.onChange('key', [{ cores: [1, 2, 4] }])
    )
    wrapper.update()

    // Step 2
    act(() => wrapper.find('Modal').props().onOk())
    wrapper.update()

    // Set low priority
    act(() =>
      wrapper
        .find('ForwardRef')
        .at(1)
        .props()
        .onChange({ target: { value: false } })
    )
    wrapper.update()
  })
})
