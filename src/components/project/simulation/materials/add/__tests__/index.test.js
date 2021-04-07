import Add from '@/components/project/simulation/materials/add'
import { shallow } from 'enzyme'

jest.mock('@/components/assets/button', () => {
  const AddButton = () => <div />
  return { AddButton }
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

let wrapper
describe('components/project/simulation/materials/add', () => {
  const material = {
    selected: ['uuid1', 'uuid3']
  }
  const simulation = {
    id: 'id',
    scheme: {
      configuration: {
        materials: {
          values: []
        }
      }
    }
  }
  const part = { solids: [{ uuid: 'uuid1' }, { uuid: 'uuid2' }] }
  const mutateOneSimulation = jest.fn()
  const swr = {
    mutateOneSimulation
  }
  const close = jest.fn()

  beforeEach(() => {
    mockError.mockReset()

    mockUpdate.mockReset()

    close.mockReset()

    wrapper = shallow(
      <Add
        disabled={false}
        material={material}
        simulation={simulation}
        part={part}
        swr={swr}
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
    expect(mutateOneSimulation).toHaveBeenCalledTimes(1)
    expect(close).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Without values
    wrapper.unmount()
    simulation.scheme.configuration.materials = {}
    wrapper = shallow(
      <Add
        material={material}
        simulation={simulation}
        part={part}
        swr={swr}
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
    expect(mutateOneSimulation).toHaveBeenCalledTimes(2)
    expect(close).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
  })
})
