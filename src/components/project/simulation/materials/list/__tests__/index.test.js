import List from '@/components/project/simulation/materials/list'
import { shallow } from 'enzyme'

jest.mock('@/components/assets/button', () => {
  const EditButton = () => <div />
  return { EditButton }
})

jest.mock('../../delete', () => {
  const Delete = () => <div />
  return Delete
})

jest.mock('react-redux', () => ({
  useDispatch: () => () => {}
}))

const mockEnable = jest.fn()
const mockDisable = jest.fn()
const mockSelect = jest.fn()
jest.mock('@/store/select/action', () => ({
  enable: () => mockEnable(),
  disable: () => mockDisable(),
  select: () => mockSelect()
}))

let wrapper
describe('components/project/simulation/materials/list', () => {
  const simulation = {
    id: 'id',
    scheme: {
      configuration: {
        materials: {
          title: 'title',
          values: [
            {
              selected: ['uuid'],
              material: {}
            }
          ]
        }
      }
    }
  }
  const mutateOneSimulation = jest.fn()
  const swr = {
    mutateOneSimulation
  }
  const onEdit = jest.fn()

  beforeEach(() => {
    mockEnable.mockReset()
    mockDisable.mockReset()
    mockSelect.mockReset()

    onEdit.mockReset()

    wrapper = shallow(
      <List simulation={simulation} swr={swr} onEdit={onEdit} />
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('render', () => {
    expect(wrapper).toBeDefined()
  })

  test('highlight', () => {
    wrapper.find('Card').props().onMouseEnter('key', 0)
    expect(mockEnable).toHaveBeenCalledTimes(1)
    expect(mockSelect).toHaveBeenCalledTimes(1)
  })

  test('unhighlight', () => {
    wrapper.find('Card').props().onMouseLeave()
    expect(mockDisable).toHaveBeenCalledTimes(1)
  })

  test('edit', () => {
    global.setTimeout = (callback) => callback()
    wrapper.find('EditButton').props().onEdit()
    expect(onEdit).toHaveBeenCalledTimes(1)
  })

  test('empty simulation', () => {
    wrapper.unmount()
    simulation.scheme = {}
    wrapper = shallow(
      <List simulation={simulation} swr={swr} onEdit={onEdit} />
    )
    expect(wrapper).toBeDefined()
  })
})
