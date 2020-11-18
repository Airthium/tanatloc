import Run from '../../../../../components/project/simulation/run'
import { shallow, mount } from 'enzyme'

const mockUpdate = jest.fn()
const mockMutate = jest.fn()
jest.mock('../../../../../../src/api/simulation', () => ({
  update: async () => mockUpdate(),
  useSimulations: () => [[], { mutateOneSimulation: mockMutate }]
}))

let wrapper
describe('renderer/components/project/simulation/parameters', () => {
  const project = {}
  const simulation = {
    scheme: {
      categories: {
        run: {}
      }
    }
  }

  beforeEach(() => {
    mockUpdate.mockReset()
    mockMutate.mockReset()
    wrapper = shallow(<Run project={project} simulation={simulation} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('addRun', () => {
    wrapper.find('Button').props().onClick()
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })

  it('with subMenus', () => {
    wrapper.unmount()
    simulation.scheme.categories.run.subMenus = [{ title: 'title' }]
    wrapper = shallow(<Run project={project} simulation={simulation} />)
    wrapper.find('Button').props().onClick()
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })
})
