import BoundaryConditions from '../../../../../components/project/simulation/boundaryConditions'
import { shallow } from 'enzyme'

jest.mock('../../../../../components/assets/formula', () => 'formula')

jest.mock('react-redux', () => ({
  useSelector: () => {},
  useDispatch: () => {}
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
})
