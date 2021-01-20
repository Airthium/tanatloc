import Edit from '../../../../../components/project/simulation/boundaryConditions/edit'
import { shallow } from 'enzyme'

jest.mock('../../../../../components/assets/button', () => ({
  EditButton: 'EditButton'
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
describe('renderer/components/project/simulation/boundaryConditions/edit', () => {
  const boundaryCondition = {
    type: {
      key: 'key'
    },
    selected: ['uuid1', 'uuid3']
  }
  const oldBoundaryCondition = {
    type: {
      key: 'key'
    },
    selected: ['uuid1', 'uuid2']
  }
  const project = {}
  const simulation = {
    scheme: {
      configuration: {
        boundaryConditions: {
          key: {
            values: [{}]
          },
          otherKey: {
            values: [{}]
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
      <Edit
        disabled={false}
        boundaryCondition={boundaryCondition}
        oldBoundaryCondition={oldBoundaryCondition}
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

  it('onEdit', async () => {
    await wrapper.find('EditButton').props().onEdit()
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockMutate).toHaveBeenCalledTimes(1)
    expect(close).toHaveBeenCalledTimes(1)
    expect(mockSentry).toHaveBeenCalledTimes(0)

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('EditButton').props().onEdit()
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockMutate).toHaveBeenCalledTimes(1)
    expect(close).toHaveBeenCalledTimes(1)
    expect(mockSentry).toHaveBeenCalledTimes(1)
  })

  it('onEdit (different old type)', async () => {
    wrapper.unmount()

    oldBoundaryCondition.type.key = 'otherKey'
    wrapper = shallow(
      <Edit
        disabled={false}
        boundaryCondition={boundaryCondition}
        oldBoundaryCondition={oldBoundaryCondition}
        project={project}
        simulation={simulation}
        part={part}
        close={close}
      />
    )
    await wrapper.find('EditButton').props().onEdit()
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockMutate).toHaveBeenCalledTimes(1)
    expect(close).toHaveBeenCalledTimes(1)
    expect(mockSentry).toHaveBeenCalledTimes(0)
  })
})
