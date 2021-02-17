import Administration from '..'
import { shallow } from 'enzyme'

const mockReplace = jest.fn()
const mockQuery = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    replace: () => mockReplace(),
    query: mockQuery()
  })
}))

jest.mock('../users', () => 'users')
jest.mock('../registration', () => 'registration')

let wrapper
describe('src/components/administration', () => {
  beforeEach(() => {
    mockReplace.mockReset()
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({ tab: 'tab' }))

    wrapper = shallow(<Administration />)
  })

  it('exists', () => {
    expect(wrapper).toBeDefined()
  })

  it('onChange', () => {
    wrapper.find('Tabs').props().onChange()
    expect(mockReplace).toHaveBeenCalledTimes(1)
  })

  it('without query', () => {
    wrapper.unmount()
    mockQuery.mockImplementation(() => ({}))
    wrapper = shallow(<Administration />)
  })
})
