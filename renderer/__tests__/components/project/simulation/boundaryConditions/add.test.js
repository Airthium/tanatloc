import Add from '../../../../../components/project/simulation/boundaryConditions/add'
import { shallow } from 'enzyme'

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
describe('renderer/components/project/simulation/boundaryConditions/add', () => {
  const boundaryCondition = {
    type: {
      key: 'key'
    },
    selected: ['uuid1', 'uuid3']
  }
  const project = {}
  const simulation = {
    scheme: {
      configuration: {
        boundaryConditions: {
          key: {
            values: []
          }
        }
      }
    }
  }
  const part = { faces: [{ uuid: 'uuid1' }, { uuid: 'uuid2' }] }
  const close = jest.fn()

  beforeEach(() => {
    mockUpdate.mockReset()
    mockMutate.mockReset()

    mockSentry.mockReset()

    close.mockReset()

    wrapper = shallow(
      <Add
        disabled={false}
        boundaryCondition={boundaryCondition}
        project={project}
        simulation={simulation}
        part={part}
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

  it('onAdd', async () => {
    await wrapper.find('Button').props().onClick()
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockMutate).toHaveBeenCalledTimes(1)
    expect(close).toHaveBeenCalledTimes(1)
    expect(mockSentry).toHaveBeenCalledTimes(0)

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('Button').props().onClick()
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockMutate).toHaveBeenCalledTimes(1)
    expect(close).toHaveBeenCalledTimes(1)
    expect(mockSentry).toHaveBeenCalledTimes(1)
  })
})
