import Rescale from '..'
import { shallow, mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import '@/config/jest/mockMatchMedia'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

let wrapper
describe('plugins/rescale/src/components/index', () => {
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
    mockError.mockReset()

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

  it('onOk', async () => {
    // Step 1
    wrapper
      .find('Table')
      .props()
      .rowSelection.onChange('key', [{ fullCores: [] }])
    await wrapper.find('Modal').props().onOk()

    // Step 2
    await wrapper.find('Modal').props().onOk()

    // Step 1
    wrapper
      .find('Table')
      .props()
      .rowSelection.onChange('key', [{ fullCores: [] }])
    await wrapper.find('Modal').props().onOk()

    // Error
    const form = wrapper.find('ForwardRef(InternalForm)').props().form
    form.validateFields = () => {
      throw new Error()
    }
    await wrapper.find('Modal').props().onOk()
    expect(mockError).toHaveBeenCalledTimes(1)
  })

  it('onCancel', () => {
    wrapper.find('Modal').props().onCancel()
  })

  it('getCheckboxProps', () => {
    wrapper.find('Table').props().rowSelection.getCheckboxProps({})
  })

  it('onValuesChange', () => {
    // Got to step 2
    wrapper
      .find('Table')
      .props()
      .rowSelection.onChange('key', [{ fullCores: [1, 2, 4, 8] }])
    wrapper.find('Modal').props().onOk()

    wrapper.find('ForwardRef(InternalForm)').props().onValuesChange({}, {})

    wrapper
      .find('ForwardRef(InternalForm)')
      .props()
      .onValuesChange({ numberOfCores: 2 }, { numberOfCores: 2 })

    wrapper
      .find('ForwardRef(InternalForm)')
      .props()
      .onValuesChange({ numberOfCores: 7 }, { numberOfCores: 7 })

    wrapper
      .find('ForwardRef(InternalForm)')
      .props()
      .onValuesChange({ numberOfCores: 1000 }, { numberOfCores: 1000 })

    wrapper
      .find('ForwardRef(InternalForm)')
      .props()
      .onValuesChange({ numberOfCores: 3 }, { numberOfCores: 3 })

    wrapper
      .find('ForwardRef(InternalForm)')
      .props()
      .onValuesChange({ numberOfCores: 0 }, { numberOfCores: 0 })
  })

  it('setVisible', () => {
    wrapper.find('Button').props().onClick()
    expect(wrapper.find('Modal').props().visible).toBe(true)
  })

  it('parser', () => {
    // Got to step 2
    wrapper
      .find('Table')
      .props()
      .rowSelection.onChange('key', [{ fullCores: [1, 2, 4, 8] }])
    wrapper.find('Modal').props().onOk()

    wrapper.find({ id: 'numberOfCores' }).props().parser()
  })

  it('render', () => {
    wrapper.find('Table').props().columns[0].render('text', {})
    wrapper.find('Table').props().columns[1].render([1, 2, 3])
    wrapper.find('Table').props().columns[2].render(5000)
  })

  it('useEffect', async () => {
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
    await act(async () => await wrapper.find('Modal').props().onOk())
    wrapper.update()

    // Set low priority
    act(() =>
      wrapper
        .find('ForwardRef(InternalForm)')
        .props()
        .onValuesChange({ lowPriority: false })
    )
    wrapper.update()
  })
})
