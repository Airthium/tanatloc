import HPC from '../'
import { shallow } from 'enzyme'

let wrapper
describe('components/help/doc/hpc', () => {
  beforeEach(() => {
    wrapper = shallow(<HPC />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('render', () => {
    expect(wrapper).toBeDefined()
  })
})
