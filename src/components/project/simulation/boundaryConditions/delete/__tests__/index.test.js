import Delete from '@/components/project/simulation/boundaryConditions/delete'
import { shallow } from 'enzyme'

jest.mock('react-redux', () => ({
  useDispatch: () => () => {}
}))

jest.mock('@/components/assets/button', () => {
  const DeleteButton = () => <div />
  return { DeleteButton }
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
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
describe('components/project/simulation/boundaryConditions/delete', () => {
  const simulation = {
    scheme: {
      configuration: {
        boundaryConditions: {
          index: 3,
          firstKey: {},
          key: {
            values: [
              {
                selected: ['uuid']
              },
              {}
            ]
          }
        }
      }
    }
  }
  const type = 'key'
  const index = 0
  const mutateOneSimulation = jest.fn()
  const swr = {
    mutateOneSimulation
  }

  beforeEach(() => {
    mockError.mockReset()

    mockUnselect.mockReset()

    mockUpdate.mockReset()

    wrapper = shallow(
      <Delete simulation={simulation} type={type} index={index} swr={swr} />
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
    simulation.scheme.configuration.boundaryConditions.key.values = [
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
