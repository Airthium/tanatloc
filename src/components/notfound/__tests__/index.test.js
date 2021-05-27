import NotFound from '@/components/notfound'
import { shallow } from 'enzyme'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: () => mockRouter()
  })
}))

let wrapper
describe('components/notfound', () => {
  beforeEach(() => {
    mockRouter.mockReset()
    wrapper = shallow(<NotFound />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('render', () => {
    expect(wrapper).toBeDefined()
  })

  test('onClick', () => {
    wrapper.find('Title').at(2).props().onClick()
    expect(mockRouter).toHaveBeenCalledTimes(1)
  })
})
