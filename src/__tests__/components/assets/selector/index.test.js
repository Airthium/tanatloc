import Selector from '../../../../components/assets/selector'
import { shallow, mount } from 'enzyme'

const mockType = jest.fn()
const mockHighlighted = jest.fn()
const mockSelected = jest.fn()
jest.mock('react-redux', () => ({
  useSelector: (callback) =>
    callback({
      select: {
        type: mockType(),
        highlighted: mockHighlighted(),
        selected: mockSelected()
      }
    }),
  useDispatch: () => () => {}
}))

const mockHighlight = jest.fn()
const mockUnhighlight = jest.fn()
const mockSelect = jest.fn()
const mockUnselect = jest.fn()
jest.mock('../../../../store/select/action', () => ({
  highlight: () => mockHighlight(),
  unhighlight: () => mockUnhighlight(),
  select: () => mockSelect(),
  unselect: () => mockUnselect()
}))

let wrapper
describe('renderer/components/assets/selector', () => {
  const part = {
    faces: [
      {
        uuid: 'uuid'
      },
      {
        uuid: 'uuid2'
      }
    ]
  }
  const updateSelected = jest.fn()

  beforeEach(() => {
    mockType.mockReset()
    mockType.mockImplementation(() => 'faces')
    mockHighlighted.mockReset()
    mockSelected.mockReset()
    mockSelected.mockImplementation(() => [])

    mockHighlight.mockReset()
    mockUnhighlight.mockReset()
    mockSelect.mockReset()
    mockUnselect.mockReset()

    updateSelected.mockReset()

    wrapper = shallow(<Selector part={part} updateSelected={updateSelected} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('empty render', () => {
    wrapper.unmount()
    wrapper = shallow(<Selector part={{}} updateSelected={updateSelected} />)
    expect(wrapper).toBeDefined()
  })

  it('onHighlight', () => {
    wrapper.find('Card').at(0).props().onMouseEnter('uuid')
    expect(mockHighlight).toHaveBeenCalledTimes(1)
  })

  it('onUnhighlight', () => {
    wrapper.find('Card').at(0).props().onMouseLeave()
    expect(mockUnhighlight).toHaveBeenCalledTimes(1)
  })

  it('onSelect', () => {
    // Select
    wrapper.find('Card').at(0).props().onClick('uuid')
    expect(mockSelect).toHaveBeenCalledTimes(1)

    // Unselect
    wrapper.unmount()
    mockSelected.mockImplementation(() => ['uuid'])
    wrapper = shallow(<Selector part={part} updateSelected={updateSelected} />)
    wrapper.find('Card').at(0).props().onClick('uuid')
    expect(mockUnselect).toHaveBeenCalledTimes(1)
  })

  it('face highlighted', () => {
    wrapper.unmount()
    mockHighlighted.mockImplementation(() => 'uuid')
    wrapper = shallow(<Selector part={part} updateSelected={updateSelected} />)
    expect(wrapper.find('Card').at(0).props().style.border).toBe(
      '2px solid #0096C7'
    )
  })

  it('effect', () => {
    wrapper.unmount()

    wrapper = mount(<Selector part={part} updateSelected={updateSelected} />)
    expect(updateSelected).toHaveBeenCalledTimes(1)
  })
})
