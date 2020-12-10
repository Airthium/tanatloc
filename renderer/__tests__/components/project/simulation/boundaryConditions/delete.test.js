import Delete from '../../../../../components/project/simulation/boundaryConditions/delete'
import { shallow } from 'enzyme'

jest.mock('react-redux', () => ({
  useDispatch: () => () => {}
}))

const mockUnselect = jest.fn()
jest.mock('../../../../../store/select/action', () => ({
  unselect: () => mockUnselect()
}))

const mockUpdate = jest.fn()
const mockMutate = jest.fn()
jest.mock('../../../../../../src/api/simulation', () => ({
  update: async () => mockUpdate(),
  useSimulations: () => [[], { mutateOneSimulation: mockMutate }]
}))

const mockSentry = jest.fn()
jest.mock('../../../../../../src/lib/sentry', () => ({
  captureException: () => mockSentry()
}))

let wrapper
describe('renderer/components/project/simulation/boundaryConditions/delete', () => {
  const project = {}
  const simulation = {
    scheme: {
      configuration: {
        boundaryConditions: {
          key: {
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
  const type = 'key'
  const index = 0

  beforeEach(() => {
    mockUnselect.mockReset()

    mockUpdate.mockReset()
    mockMutate.mockReset()

    mockSentry.mockReset()

    wrapper = shallow(
      <Delete
        project={project}
        simulation={simulation}
        type={type}
        index={index}
      />
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })
})
