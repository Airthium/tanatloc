import Administration from '..'
import { shallow } from 'enzyme'

const mockReplace = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    replace: () => mockReplace(),
    query: { tab: 'tab' }
  })
}))

jest.mock('../users', () => 'users')
jest.mock('../registration', () => 'registration')

let wrapper
describe('src/components/administration', () => {
  beforeEach(() => {
    mockReplace.mockReset()

    wrapper = shallow(<Administration />)
  })

  it('exists', () => {
    expect(wrapper).toBeDefined()
  })

  it('onChange', () => {
    wrapper.find('Tabs').props().onChange()
    expect(mockReplace).toHaveBeenCalledTimes(1)
  })
})
