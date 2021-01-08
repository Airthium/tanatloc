import Material from '../../../../../components/project/simulation/materials/material'
import { shallow, mount } from 'enzyme'

jest.mock('../../../../../components/assets/formula', () => 'Formula')
jest.mock('../../../../../components/assets/selector', () => 'Selector')
jest.mock(
  '../../../../../components/project/simulation/materials/database',
  () => 'database'
)
jest.mock(
  '../../../../../components/project/simulation/materials/add',
  () => 'Add'
)

let wrapper
describe('renderer/components/project/simulation/materials/material', () => {
  const project = {}
  const simulation = {}
  const part = {}
  const materials = {
    label: 'label',
    children: [
      {
        default: 0
      }
    ]
  }
  let material = undefined

  const close = jest.fn()

  beforeEach(() => {
    close.mockReset()

    wrapper = shallow(
      <Material
        project={project}
        simulation={simulation}
        visible={true}
        part={part}
        materials={materials}
        material={material}
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
    wrapper.find('database').props().onSelect()
  })

  it('custom', () => {
    wrapper.find('Formula').props().onChange()
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
        project={project}
        simulation={simulation}
        visible={true}
        part={part}
        materials={materials}
        material={material}
        close={close}
      />
    )

    // Enable
    wrapper.unmount()
    material = {
      selected: [{ uuid: 'uuid', label: 1 }],
      material: {}
    }
    wrapper = mount(
      <Material
        project={project}
        simulation={simulation}
        visible={true}
        part={part}
        materials={materials}
        material={material}
        close={close}
      />
    )
  })
})
