import Materials from '../../../../../components/project/simulation/materials'
import { shallow, mount } from 'enzyme'

jest.mock('../../../../../components/assets/button', () => ({
  AddButton: 'AddButton'
}))

jest.mock(
  '../../../../../components/project/simulation/materials/list',
  () => 'List'
)
jest.mock(
  '../../../../../components/project/simulation/materials/material',
  () => 'Material'
)

jest.mock('react-redux', () => ({
  useDispatch: () => () => {}
}))

const mockEnable = jest.fn()
const mockDisable = jest.fn()
const mockSetType = jest.fn()
const mockSetPart = jest.fn()
jest.mock('../../../../../store/select/action', () => ({
  enable: () => mockEnable(),
  disable: () => mockDisable(),
  setType: () => mockSetType(),
  setPart: () => mockSetPart()
}))

let wrapper
describe('renderer/components/project/simulation/materials', () => {
  const project = {}
  const simulation = {
    scheme: {
      configuration: {
        materials: {
          index: 1,
          label: 'label',
          values: [{}]
        }
      }
    }
  }
  const part = {}
  const setVisible = jest.fn()

  beforeEach(() => {
    mockEnable.mockReset()
    mockDisable.mockReset()
    mockSetType.mockReset()
    mockSetPart.mockReset()

    setVisible.mockReset()
    wrapper = shallow(
      <Materials
        project={project}
        simulation={simulation}
        part={part}
        setVisible={setVisible}
      />
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onAdd', () => {
    wrapper.find('AddButton').props().onAdd()
    expect(mockEnable).toHaveBeenCalledTimes(1)
  })

  it('onEdit', () => {
    wrapper.find('List').props().onEdit()
  })

  it('onClose', () => {
    wrapper.find('Material').props().close()
    expect(mockDisable).toHaveBeenCalledTimes(1)
  })

  it('effect', () => {
    wrapper.unmount()

    wrapper = mount(
      <Materials
        project={project}
        simulation={simulation}
        part={part}
        setVisible={setVisible}
      />
    )
    expect(mockSetType).toHaveBeenCalledTimes(1)
    expect(mockSetPart).toHaveBeenCalledTimes(1)
  })
})
