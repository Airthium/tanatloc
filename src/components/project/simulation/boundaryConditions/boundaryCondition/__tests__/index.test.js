import BoundaryCondition from '@/components/project/simulation/boundaryConditions/boundaryCondition'
import { shallow, mount } from 'enzyme'

jest.mock('@/components/assets/formula', () => 'Formula')
jest.mock('@/components/assets/selector', () => 'Selector')
jest.mock('@/components/project/simulation/boundaryConditions/add', () => 'Add')
jest.mock(
  '@/components/project/simulation/boundaryConditions/edit',
  () => 'Edit'
)

let wrapper
describe('src/components/project/simulation/boundaryConditions/boundaryCondition', () => {
  const project = {}
  const simulation = {}
  const part = {}
  const boundaryConditions = {
    title: 'title',
    key: {
      label: 'label',
      children: [
        {
          default: 0
        }
      ]
    }
  }
  let boundaryCondition = undefined

  const close = jest.fn()

  beforeEach(() => {
    close.mockReset()

    wrapper = shallow(
      <BoundaryCondition
        project={project}
        simulation={simulation}
        visible={true}
        part={part}
        boundaryConditions={boundaryConditions}
        boundaryCondition={boundaryCondition}
        close={close}
      />
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onName', () => {
    wrapper
      .find('Card')
      .at(0)
      .props()
      .children.props.onChange({ target: { value: 'name' } })
  })

  it('onType', () => {
    wrapper
      .find('Card')
      .at(1)
      .props()
      .children.props.onChange({ target: { value: 'key' } })

    // Without children
    wrapper.unmount()
    wrapper = shallow(
      <BoundaryCondition
        project={project}
        simulation={simulation}
        visible={true}
        part={part}
        boundaryConditions={{
          title: 'title',
          key: {
            label: 'label'
          }
        }}
        boundaryCondition={boundaryCondition}
        close={close}
      />
    )
    wrapper
      .find('Card')
      .at(1)
      .props()
      .children.props.onChange({ target: { value: 'key' } })
  })

  it('onSelected', () => {
    wrapper.find('Selector').props().updateSelected()
  })

  it('onClose', () => {
    wrapper.find('Add').props().close()
    expect(close).toHaveBeenCalledTimes(1)
  })

  it('edit', () => {
    wrapper.unmount()
    boundaryCondition = {}
    wrapper = shallow(
      <BoundaryCondition
        project={project}
        simulation={simulation}
        visible={true}
        part={part}
        boundaryConditions={boundaryConditions}
        boundaryCondition={boundaryCondition}
        close={close}
      />
    )
    expect(wrapper.find('Edit').length).toBe(1)
  })

  it('effect', () => {
    // With boundaryCondition
    wrapper.unmount()
    boundaryCondition = { selected: [{ uuid: 'uuid', label: 1 }] }
    wrapper = mount(
      <BoundaryCondition
        project={project}
        simulation={simulation}
        visible={true}
        part={part}
        boundaryConditions={boundaryConditions}
        boundaryCondition={boundaryCondition}
        close={close}
      />
    )

    // Without boundaryCondition
    wrapper.unmount()
    boundaryCondition = null
    wrapper = mount(
      <BoundaryCondition
        project={project}
        simulation={simulation}
        visible={true}
        part={part}
        boundaryConditions={boundaryConditions}
        boundaryCondition={boundaryCondition}
        close={close}
      />
    )

    // Enable
    wrapper.unmount()
    boundaryCondition = {
      name: 'name',
      selected: [{ uuid: 'uuid', label: 1 }],
      values: [0]
    }
    wrapper = mount(
      <BoundaryCondition
        project={project}
        simulation={simulation}
        visible={true}
        part={part}
        boundaryConditions={boundaryConditions}
        boundaryCondition={boundaryCondition}
        close={close}
      />
    )
  })

  it('onChange', () => {
    boundaryCondition = {
      type: {
        key: 'key',
        children: [
          {
            default: 1
          }
        ]
      },
      name: 'name',
      selected: [{ uuid: 'uuid', label: 1 }],
      values: []
    }
    wrapper = mount(
      <BoundaryCondition
        project={project}
        simulation={simulation}
        visible={true}
        part={part}
        boundaryConditions={boundaryConditions}
        boundaryCondition={boundaryCondition}
        close={close}
      />
    )
    wrapper.find('Formula').props().onChange(0, 10)
  })
})
