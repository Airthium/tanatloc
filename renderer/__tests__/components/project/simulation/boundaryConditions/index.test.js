import BoundaryConditions from '../../../../../components/project/simulation/boundaryConditions'
import { shallow, mount } from 'enzyme'

jest.mock('../../../../../components/assets/formula', () => 'formula')

const mockHighlighted = jest.fn()
const mockSelected = jest.fn(() => [])
jest.mock('react-redux', () => ({
  useSelector: (callback) =>
    callback({
      select: { highlighted: mockHighlighted(), selected: mockSelected() }
    }),
  useDispatch: () => () => {}
}))

jest.mock('../../../../../store/select/action', () => ({
  enable: jest.fn(),
  disable: jest.fn(),
  setType: jest.fn(),
  setPart: jest.fn(),
  highlight: jest.fn(),
  unhighlight: jest.fn(),
  select: jest.fn(),
  unselect: jest.fn()
}))

const mockUpdate = jest.fn()
const mockMutate = jest.fn()
jest.mock('../../../../../../src/api/simulation', () => ({
  update: async () => mockUpdate(),
  useSimulations: () => [[], { mutateOneSimulation: mockMutate }]
}))

let wrapper
describe('renderer/components/project/simulation/boundaryConditions', () => {
  const project = {}
  const simulation = {
    scheme: {
      configuration: {
        boundaryConditions: {
          index: 1,
          title: 'title',
          dirichlet: {
            children: [{}],
            values: [
              {
                selected: ['uuid']
              }
            ]
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
    mockUpdate.mockReset()
    mockMutate.mockReset()
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

  // it('toggleBoundaryCondition', () => {
  //   wrapper.find('Button').at(3).props().onClick()
  //   expect(setVisible).toHaveBeenCalledTimes(1)

  //   wrapper.find('Button').at(3).props().onClick()
  // })

  // it('addBoundaryCondition', () => {
  //   wrapper.find('Button').at(0).props().onClick()
  //   expect(setVisible).toHaveBeenCalledTimes(1)
  // })

  // it('onType', () => {
  //   wrapper
  //     .find({ buttonStyle: 'solid' })
  //     .props()
  //     .onChange({
  //       target: {
  //         value: 'dirichlet'
  //       }
  //     })
  // })

  // it('onAdd', () => {
  //   wrapper.unmount()
  //   simulation.scheme.configuration.boundaryConditions.dirichlet.values = undefined
  //   wrapper = shallow(
  //     <BoundaryConditions
  //       project={project}
  //       simulation={simulation}
  //       part={part}
  //       setVisible={setVisible}
  //     />
  //   )

  //   wrapper
  //     .find({ buttonStyle: 'solid' })
  //     .props()
  //     .onChange({
  //       target: {
  //         value: 'dirichlet'
  //       }
  //     })

  //   wrapper.find('Button').at(2).props().onClick()

  //   wrapper.unmount()
  //   mockSelected.mockImplementation(() => ['uuid'])
  //   part.faces = [{ uuid: 'uuid1' }, { uuid: 'uuid' }]
  //   simulation.scheme.configuration.boundaryConditions.dirichlet.values = []
  //   wrapper = shallow(
  //     <BoundaryConditions
  //       project={project}
  //       simulation={simulation}
  //       part={part}
  //       setVisible={setVisible}
  //     />
  //   )

  //   wrapper
  //     .find({ buttonStyle: 'solid' })
  //     .props()
  //     .onChange({
  //       target: {
  //         value: 'dirichlet'
  //       }
  //     })

  //   wrapper.find('Button').at(2).props().onClick()

  //   // Error
  //   wrapper.unmount()
  //   mockUpdate.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   mockSelected.mockImplementation(() => ['uuid'])
  //   part.faces = [{ uuid: 'uuid1' }, { uuid: 'uuid' }]
  //   simulation.scheme.configuration.boundaryConditions.dirichlet.values = []
  //   wrapper = shallow(
  //     <BoundaryConditions
  //       project={project}
  //       simulation={simulation}
  //       part={part}
  //       setVisible={setVisible}
  //     />
  //   )

  //   wrapper
  //     .find({ buttonStyle: 'solid' })
  //     .props()
  //     .onChange({
  //       target: {
  //         value: 'dirichlet'
  //       }
  //     })

  //   wrapper.find('Button').at(2).props().onClick()
  // })

  // it('type', () => {
  //   wrapper
  //     .find({ buttonStyle: 'solid' })
  //     .props()
  //     .onChange({
  //       target: {
  //         value: 'dirichlet'
  //       }
  //     })

  //   wrapper.find('formula').props().onChange()
  // })

  // it('part', () => {
  //   wrapper.unmount()

  //   part.faces = [{}]
  //   wrapper = shallow(
  //     <BoundaryConditions
  //       project={project}
  //       simulation={simulation}
  //       part={part}
  //       setVisible={setVisible}
  //     />
  //   )
  // })

  // it('highlight / select', () => {
  //   wrapper.unmount()

  //   part.faces = [{ uuid: 'uuid' }]
  //   wrapper = shallow(
  //     <BoundaryConditions
  //       project={project}
  //       simulation={simulation}
  //       part={part}
  //       setVisible={setVisible}
  //     />
  //   )

  //   // Highlight
  //   wrapper.find('Card').at(2).props().onMouseOver()

  //   // Unhighlight
  //   wrapper.find('Card').at(2).props().onMouseOut()

  //   // Select
  //   wrapper.find('Card').at(2).props().onClick()

  //   // Highlighted
  //   wrapper.unmount()
  //   mockHighlighted.mockImplementation(() => 'uuid')
  //   wrapper = shallow(
  //     <BoundaryConditions
  //       project={project}
  //       simulation={simulation}
  //       part={part}
  //       setVisible={setVisible}
  //     />
  //   )

  //   // Selected
  //   wrapper.unmount()
  //   mockHighlighted.mockImplementation(() => {})
  //   mockSelected.mockImplementation(() => ['uuid'])
  //   wrapper = shallow(
  //     <BoundaryConditions
  //       project={project}
  //       simulation={simulation}
  //       part={part}
  //       setVisible={setVisible}
  //     />
  //   )
  //   wrapper.find('Card').at(2).props().onClick('uuid')
  // })

  // it('highlightCurrent', () => {
  //   wrapper = shallow(
  //     <BoundaryConditions
  //       project={project}
  //       simulation={simulation}
  //       part={part}
  //       setVisible={setVisible}
  //     />
  //   )
  //   wrapper.find('Card').at(0).props().onMouseEnter('dirichlet', 0)
  // })

  // it('unhighlightCurrent', () => {
  //   wrapper = shallow(
  //     <BoundaryConditions
  //       project={project}
  //       simulation={simulation}
  //       part={part}
  //       setVisible={setVisible}
  //     />
  //   )
  //   wrapper.find('Card').at(0).props().onMouseLeave()
  // })

  // it('onEdit', () => {
  //   wrapper = shallow(
  //     <BoundaryConditions
  //       project={project}
  //       simulation={simulation}
  //       part={part}
  //       setVisible={setVisible}
  //     />
  //   )
  //   wrapper.find('Card').at(0).props().children[1].props.onClick('dirichlet', 0)
  // })

  // it('onDelete', () => {
  //   wrapper = shallow(
  //     <BoundaryConditions
  //       project={project}
  //       simulation={simulation}
  //       part={part}
  //       setVisible={setVisible}
  //     />
  //   )
  //   wrapper
  //     .find('Card')
  //     .at(0)
  //     .props()
  //     .children[2].props.onConfirm('dirichlet', 0)

  //   // Error
  //   mockUpdate.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   wrapper
  //     .find('Card')
  //     .at(0)
  //     .props()
  //     .children[2].props.onConfirm('dirichlet', 0)
  // })

  // it('effect', () => {
  //   wrapper.unmount()

  //   wrapper = mount(
  //     <BoundaryConditions
  //       project={project}
  //       simulation={simulation}
  //       part={part}
  //       setVisible={setVisible}
  //     />
  //   )

  //   wrapper.unmount()
  //   part.faces = undefined
  //   wrapper = mount(
  //     <BoundaryConditions
  //       project={project}
  //       simulation={simulation}
  //       part={part}
  //       setVisible={setVisible}
  //     />
  //   )
  // })
})
