import NotAuthorized from '@/components/notauthorized'
import { mount, shallow } from 'enzyme'

const mockPrefetch = jest.fn()
const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    prefetch: mockPrefetch,
    push: mockPush
  })
}))

let wrapper
describe('components/notfound', () => {
  beforeEach(() => {
    mockPrefetch.mockReset()
    mockPush.mockReset()
    wrapper = shallow(<NotAuthorized />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('render', () => {
    expect(wrapper).toBeDefined()
  })

  test('onClick', () => {
    wrapper.find({ type: 'link' }).props().onClick()
    expect(mockPush).toHaveBeenCalledTimes(1)
  })

  // test('effect', () => {
  //   wrapper.unmount()

  //   wrapper = mount(<NotAuthorized />)
  //   expect(mockPrefetch).toHaveBeenCalledTimes(1)
  // })
})
