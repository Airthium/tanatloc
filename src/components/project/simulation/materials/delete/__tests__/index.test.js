import Delete from '@/components/project/simulation/materials/delete'
import { shallow } from 'enzyme'

jest.mock('react-redux', () => ({
  useDispatch: () => () => {}
}))

jest.mock('@/components/assets/button', () => ({
  DeleteButton: 'DeleteButton'
}))

const mockUnselect = jest.fn()
jest.mock('@/store/select/action', () => ({
  unselect: () => mockUnselect()
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
describe('components/project/simulation/materials/delete', () => {
  const project = {}
  const simulation = {
    scheme: {
      configuration: {
        materials: {
          values: [
            {
              selected: ['uuid']
            }
          ]
        }
      }
    }
  }
  const index = 0

  beforeEach(() => {
    mockUnselect.mockReset()

    mockUpdate.mockReset()
    mockMutate.mockReset()

    mockError.mockReset()

    wrapper = shallow(
      <Delete project={project} simulation={simulation} index={index} />
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onDelete', async () => {
    await wrapper.find('DeleteButton').props().onDelete()
    expect(mockUnselect).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockMutate).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    simulation.scheme.configuration.materials.values = [
      {
        selected: ['uuid']
      }
    ]
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('DeleteButton').props().onDelete()
    expect(mockUnselect).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockMutate).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })
})
