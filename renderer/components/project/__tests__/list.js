import List from '../list'
import { shallow } from 'enzyme'

jest.mock('../card', () => 'card')

let wrapper
describe('component/project/card', () => {
  beforeEach(() => {
    wrapper = shallow(<List />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })
})
