import Delete from '@/components/project/simulation/materials/delete'
import { shallow } from 'enzyme'

jest.mock('@/components/assets/button', () => ({
  DeleteButton: 'DeleteButton'
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('react-redux', () => ({
  useDispatch: () => () => {}
}))

const mockUnselect = jest.fn()
jest.mock('@/store/select/action', () => ({
  unselect: () => mockUnselect()
}))

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

let wrapper
describe('components/project/simulation/materials/delete', () => {
  const simulation = {
    id: 'id',
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
  const mutateOneSimulation = jest.fn()
  const swr = { mutateOneSimulation }
  const index = 0

  beforeEach(() => {
    mockError.mockReset()

    mockUnselect.mockReset()

    mockUpdate.mockReset()

    wrapper = shallow(
      <Delete simulation={simulation} swr={swr} index={index} />
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('render', () => {
    expect(wrapper).toBeDefined()
  })

  test('onDelete', async () => {
    await wrapper.find('DeleteButton').props().onDelete()
    expect(mockUnselect).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mutateOneSimulation).toHaveBeenCalledTimes(1)
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
    expect(mutateOneSimulation).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })
})
