import Loading from '../../../components/loading'
import { shallow } from 'enzyme'

jest.mock('../../../components/background', () => 'background')

let wrapper
describe('renderer/components/loading', () => {
  beforeEach(() => {
    wrapper = shallow(<Loading />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })
})
