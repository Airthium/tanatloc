import Edit from '@/components/project/simulation/boundaryConditions/edit'
import { shallow } from 'enzyme'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

let wrapper
describe('components/project/simulation/boundaryConditions/edit', () => {
  const simulation = {
    id: 'id',
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
  const boundaryCondition = {
    uuid: 'uuid',
    type: {
      key: 'key'
    },
    selected: ['uuid1', 'uuid3']
  }
  const oldBoundaryCondition = {
    uuid: 'uuid',
    type: {
      key: 'key'
    },
    selected: ['uuid1', 'uuid2']
  }
  const part = { faces: [{ uuid: 'uuid1' }, { uuid: 'uuid2' }] }
  const mutateOneSimulation = jest.fn()
  const swr = { mutateOneSimulation }
  const close = jest.fn()

  beforeEach(() => {
    mockError.mockReset()

    mockUpdate.mockReset()

    mutateOneSimulation.mockReset()
    close.mockReset()

    wrapper = shallow(
      <Edit
        disabled={false}
        simulation={simulation}
        boundaryCondition={boundaryCondition}
        oldBoundaryCondition={oldBoundaryCondition}
        part={part}
        swr={swr}
        close={close}
      />
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('render', () => {
    expect(wrapper).toBeDefined()
  })

  test('onEdit', async () => {
    await wrapper.find('Button').props().onClick()
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mutateOneSimulation).toHaveBeenCalledTimes(1)
    expect(close).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('Button').props().onClick()
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mutateOneSimulation).toHaveBeenCalledTimes(1)
    expect(close).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })

  test('onEdit (different old type)', async () => {
    wrapper.unmount()

    oldBoundaryCondition.type.key = 'otherKey'
    wrapper = shallow(
      <Edit
        disabled={false}
        simulation={simulation}
        boundaryCondition={boundaryCondition}
        oldBoundaryCondition={oldBoundaryCondition}
        part={part}
        swr={swr}
        close={close}
      />
    )
    await wrapper.find('Button').props().onClick()
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mutateOneSimulation).toHaveBeenCalledTimes(1)
    expect(close).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
  })
})
