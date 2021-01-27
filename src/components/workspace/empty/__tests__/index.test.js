import Empty from '@/components/workspace/empty'
import { shallow } from 'enzyme'

jest.mock('@/components/workspace/add', () => 'add')

let wrapper
describe('components/workspace/empty', () => {
  beforeEach(() => {
    wrapper = shallow(<Empty />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })
})
