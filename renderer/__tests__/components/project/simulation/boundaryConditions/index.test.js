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

let wrapper
describe('renderer/components/project/simulation/boundaryConditions', () => {
  const project = {}
  const simulation = {
    scheme: {
      categories: {
        boundaryConditions: {
          index: 1,
          title: 'title',
          dirichlet: {
            children: [{}]
          }
        }
      }
    }
  }
  const part = {}
  const setVisible = jest.fn()

  beforeEach(() => {
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

  it('toggleBoundaryCondition', () => {
    wrapper.find('Button').at(1).props().onClick()
    expect(setVisible).toHaveBeenCalledTimes(1)

    wrapper.find('Button').at(1).props().onClick()
  })

  it('addBoundaryCondition', () => {
    wrapper.find('Button').at(0).props().onClick()
    expect(setVisible).toHaveBeenCalledTimes(1)
  })

  it('onType', () => {
    wrapper
      .find({ buttonStyle: 'solid' })
      .props()
      .onChange({
        target: {
          value: 'value'
        }
      })
  })

  it('type', () => {
    wrapper
      .find({ buttonStyle: 'solid' })
      .props()
      .onChange({
        target: {
          value: 'dirichlet'
        }
      })

    wrapper.find('formula').props().onChange()
  })

  it('part', () => {
    wrapper.unmount()

    part.faces = [{}]
    wrapper = shallow(
      <BoundaryConditions
        project={project}
        simulation={simulation}
        part={part}
        setVisible={setVisible}
      />
    )
  })

  it('highlight / select', () => {
    wrapper.unmount()

    part.faces = [{ uuid: 'uuid' }]
    wrapper = shallow(
      <BoundaryConditions
        project={project}
        simulation={simulation}
        part={part}
        setVisible={setVisible}
      />
    )

    // Highlight
    wrapper.find('Card').at(1).props().onMouseOver()

    // Unhighlight
    wrapper.find('Card').at(1).props().onMouseOut()

    // Select
    wrapper.find('Card').at(1).props().onClick()

    // Highlighted
    wrapper.unmount()
    mockHighlighted.mockImplementation(() => 'uuid')
    wrapper = shallow(
      <BoundaryConditions
        project={project}
        simulation={simulation}
        part={part}
        setVisible={setVisible}
      />
    )

    // Selected
    wrapper.unmount()
    mockHighlighted.mockImplementation(() => {})
    mockSelected.mockImplementation(() => ['uuid'])
    wrapper = shallow(
      <BoundaryConditions
        project={project}
        simulation={simulation}
        part={part}
        setVisible={setVisible}
      />
    )
    wrapper.find('Card').at(1).props().onClick('uuid')
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
  })
})
