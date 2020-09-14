import NotFound from '../../../components/notfound'
import { shallow } from 'enzyme'

let mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: () => mockRouter()
  })
}))

let wrapper
describe('renderer/components/notfound', () => {
  beforeEach(() => {
    mockRouter.mockReset()
    wrapper = shallow(<NotFound />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onClick', () => {
    wrapper.find('Title').at(2).props().onClick()
    expect(mockRouter).toHaveBeenCalledTimes(1)
  })
})
