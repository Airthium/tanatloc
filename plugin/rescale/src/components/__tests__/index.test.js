import Rescale from '..'
import { shallow } from 'enzyme'

let wrapper
describe('plugin/rescale/src/components/index', () => {
  const data = {
    coreTypes: [
      {
        name: 'name',
        cores: [1, 2, 4],
        memory: 5000,
        price: 5000,
        lowPriorityPrice: 1000
      }
    ]
  }
  const onSelect = jest.fn()

  beforeEach(() => {
    onSelect.mockReset()

    wrapper = shallow(<Rescale data={data} onSelect={onSelect} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })
})
