import Add from '@/components/project/simulation/boundaryConditions/add'
import { shallow } from 'enzyme'

jest.mock('@/components/assets/button', () => ({
  AddButton: 'AddButton'
}))

const mockUpdate = jest.fn()
const mockMutate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate(),
  useSimulations: () => [[], { mutateOneSimulation: mockMutate }]
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

let wrapper
describe('src/components/project/simulation/boundaryConditions/add', () => {
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

    mockError.mockReset()

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
    await wrapper.find('AddButton').props().onAdd()
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockMutate).toHaveBeenCalledTimes(1)
    expect(close).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Without values
    wrapper.unmount()
    simulation.scheme.configuration.boundaryConditions.key = {}
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
    await wrapper.find('AddButton').props().onAdd()

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('AddButton').props().onAdd()
    expect(mockUpdate).toHaveBeenCalledTimes(3)
    expect(mockMutate).toHaveBeenCalledTimes(2)
    expect(close).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
  })
})
