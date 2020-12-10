import BoundaryConditions from '../../../../../components/project/simulation/boundaryConditions'
import { shallow, mount } from 'enzyme'

jest.mock(
  '../../../../../components/project/simulation/boundaryConditions/list',
  () => 'List'
)
jest.mock(
  '../../../../../components/project/simulation/boundaryConditions/boundaryCondition',
  () => 'BoundaryCondition'
)

const mockHighlighted = jest.fn()
const mockSelected = jest.fn(() => [])
jest.mock('react-redux', () => ({
  // useSelector: (callback) =>
  //   callback({
  //     select: { highlighted: mockHighlighted(), selected: mockSelected() }
  //   }),
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
  // highlight: jest.fn(),
  // unhighlight: jest.fn(),
  // select: jest.fn(),
  // unselect: jest.fn()
}))

// const mockUpdate = jest.fn()
// const mockMutate = jest.fn()
// jest.mock('../../../../../../src/api/simulation', () => ({
//   update: async () => mockUpdate(),
//   useSimulations: () => [[], { mutateOneSimulation: mockMutate }]
// }))

let wrapper
describe('renderer/components/project/simulation/boundaryConditions', () => {
  const project = {}
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
  const setVisible = jest.fn()

  beforeEach(() => {
    mockHighlighted.mockReset()
    mockSelected.mockReset()
    mockSelected.mockImplementation(() => [])

    mockEnable.mockReset()
    mockDisable.mockReset()
    mockSetType.mockReset()
    mockSetPart.mockReset()

    setVisible.mockReset()
    wrapper = shallow(
      <BoundaryConditions
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
    wrapper.find('Button').props().onClick()
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

  it('effect', () => {
    wrapper.unmount()

    wrapper = mount(
      <BoundaryConditions
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
