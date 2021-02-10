import Edit from '@/components/project/simulation/materials/edit'
import { shallow } from 'enzyme'

jest.mock('@/components/assets/button', () => ({
  EditButton: 'EditButton'
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
describe('src/components/project/simulation/materials/edit', () => {
  const material = {
    selected: ['uuid1', 'uuid3']
  }
  const project = {}
  const simulation = {
    scheme: {
      configuration: {
        materials: {
          values: [{}]
        }
      }
    }
  }
  const part = { solids: [{ uuid: 'uuid1' }, { uuid: 'uuid2' }] }
  const close = jest.fn()

  beforeEach(() => {
    mockUpdate.mockReset()
    mockMutate.mockReset()

    mockError.mockReset()

    close.mockReset()

    wrapper = shallow(
      <Edit
        disabled={false}
        material={material}
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
    expect(mockError).toHaveBeenCalledTimes(0)

    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('EditButton').props().onEdit()
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockMutate).toHaveBeenCalledTimes(1)
    expect(close).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })
})
