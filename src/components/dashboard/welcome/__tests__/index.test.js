import Welcome from '@/components/dashboard/welcome'
import { shallow } from 'enzyme'

jest.mock('@/components/workspace/add', () => {
  const Add = () => <div />
  return Add
})

let wrapper
describe('components/dashboard/welcome', () => {
  const addOneWorkspace = jest.fn()
  const swr = {
    addOneWorkspace
  }

  beforeEach(() => {
    wrapper = shallow(<Welcome swr={swr} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })
})
