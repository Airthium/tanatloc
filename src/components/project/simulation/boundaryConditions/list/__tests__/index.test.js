import List from '@/components/project/simulation/boundaryConditions/list'
import { shallow } from 'enzyme'

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

jest.mock('../../delete', () => {
  const Delete = () => <div />
  return Delete
})

let wrapper
describe('components/project/simulation/boundaryConditions/list', () => {
  const simulation = {
    scheme: {
      configuration: {
        boundaryConditions: {
          title: 'title',
          key: {
            values: [
              {
                selected: ['uuid']
              }
            ]
          }
        }
      }
    }
  }
  const mutateOneSimulation = jest.fn()
  const swr = { mutateOneSimulation }
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

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onHighlight', () => {
    wrapper.find('Card').props().onMouseEnter('key', 0)
    expect(mockEnable).toHaveBeenCalledTimes(1)
    expect(mockSelect).toHaveBeenCalledTimes(1)
  })

  it('onUnhighlight', () => {
    wrapper.find('Card').props().onMouseLeave()
    expect(mockDisable).toHaveBeenCalledTimes(1)
  })

  it('edit', () => {
    global.setTimeout = (callback) => callback()
    wrapper.find('Button').props().onClick()
    expect(onEdit).toHaveBeenCalledTimes(1)
  })

  it('empty simulation', () => {
    wrapper.unmount()
    simulation.scheme = {}
    wrapper = shallow(
      <List simulation={simulation} swr={swr} onEdit={onEdit} />
    )
    expect(wrapper).toBeDefined()
  })
})
