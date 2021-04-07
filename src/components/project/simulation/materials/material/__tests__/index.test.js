import Material from '@/components/project/simulation/materials/material'
import { shallow, mount } from 'enzyme'

jest.mock('@/components/assets/formula', () => {
  const Formula = () => <div />
  return Formula
})

jest.mock('@/components/assets/selector', () => {
  const Selector = () => <div />
  return Selector
})

jest.mock('@/components/project/simulation/materials/database', () => {
  const Database = () => <div />
  return Database
})

jest.mock('@/components/project/simulation/materials/add', () => {
  const Add = () => <div />
  return Add
})

jest.mock('@/components/project/simulation/materials/edit', () => {
  const Edit = () => <div />
  return Edit
})

let wrapper
describe('components/project/simulation/materials/material', () => {
  const simulation = {}
  const part = {}
  const materials = {
    label: 'label',
    children: [
      {
        name: 'Test',
        default: 0
      }
    ]
  }
  let material = undefined
  const mutateOneSimulation = jest.fn()
  const swr = { mutateOneSimulation }
  const close = jest.fn()

  beforeEach(() => {
    close.mockReset()

    wrapper = shallow(
      <Material
        simulation={simulation}
        visible={true}
        part={part}
        materials={materials}
        material={material}
        swr={swr}
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

  it('onMaterialSelect', () => {
    wrapper.find('Database').props().onSelect()
  })

  it('onSelected', () => {
    wrapper.find('Selector').props().updateSelected()
  })

  it('onClose', () => {
    wrapper.find('Add').props().close()
    expect(close).toHaveBeenCalledTimes(1)
  })

  it('effect', () => {
    // Without material
    material = null
    wrapper = mount(
      <Material
        simulation={simulation}
        visible={true}
        part={part}
        materials={materials}
        material={material}
        swr={swr}
        close={close}
      />
    )

    // Enable
    wrapper.unmount()
    material = {
      selected: [{ uuid: 'uuid', label: 1 }],
      material: {
        children: [
          {
            symbol: 'Test'
          }
        ]
      }
    }
    wrapper = mount(
      <Material
        simulation={simulation}
        visible={true}
        part={part}
        materials={materials}
        material={material}
        swr={swr}
        close={close}
      />
    )

    wrapper.find('Formula').props().onValueChange()
  })
})
