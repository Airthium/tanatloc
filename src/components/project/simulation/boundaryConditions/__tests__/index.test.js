import BoundaryConditions from '@/components/project/simulation/boundaryConditions'
import { shallow, mount } from 'enzyme'

jest.mock('react-redux', () => ({
  useDispatch: () => () => {}
}))

jest.mock('@/components/assets/button', () => {
  const AddButton = () => <div />
  return { AddButton }
})

jest.mock('@/components/project/simulation/boundaryConditions/list', () => {
  const List = () => <div />
  return List
})
jest.mock(
  '@/components/project/simulation/boundaryConditions/boundaryCondition',
  () => {
    const BoundaryCondition = () => <div />
    return BoundaryCondition
  }
)

const mockEnable = jest.fn()
const mockDisable = jest.fn()
const mockSetType = jest.fn()
const mockSetPart = jest.fn()
jest.mock('@/store/select/action', () => ({
  enable: () => mockEnable(),
  disable: () => mockDisable(),
  setType: () => mockSetType(),
  setPart: () => mockSetPart()
}))

let wrapper
describe('components/project/simulation/boundaryConditions', () => {
  const simulation = {
    scheme: {
      configuration: {
        boundaryConditions: {
          index: 1,
          label: 'label',
          dirichlet: {
            values: [{}]
          }
        }
      }
    }
  }
  const part = {}
  const mutateOneSimulation = jest.fn()
  const swr = { mutateOneSimulation }
  const setVisible = jest.fn()

  beforeEach(() => {
    mockEnable.mockReset()
    mockDisable.mockReset()
    mockSetType.mockReset()
    mockSetPart.mockReset()

    setVisible.mockReset()
    wrapper = shallow(
      <BoundaryConditions
        simulation={simulation}
        part={part}
        swr={swr}
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
    wrapper.find('List').props().onEdit('dirichlet', 0)
    expect(mockEnable).toHaveBeenCalledTimes(1)
  })

  it('onClose', () => {
    wrapper.find('BoundaryCondition').props().close()
    expect(mockDisable).toHaveBeenCalledTimes(1)
  })

  // it('effect', () => {
  //   wrapper.unmount()
  //   wrapper = mount(
  //     <BoundaryConditions
  //       simulation={simulation}
  //       part={part}
  //       swr={swr}
  //       setVisible={setVisible}
  //     />
  //   )
  //   expect(mockSetType).toHaveBeenCalledTimes(1)
  //   expect(mockSetPart).toHaveBeenCalledTimes(1)

  //   // Without part
  //   wrapper.unmount()
  //   wrapper = mount(
  //     <BoundaryConditions
  //       simulation={simulation}
  //       swr={swr}
  //       setVisible={setVisible}
  //     />
  //   )
  // })
})
