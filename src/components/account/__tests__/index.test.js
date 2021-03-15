import Account from '..'
import { shallow } from 'enzyme'

const mockReplace = jest.fn()
const mockQuery = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    replace: () => mockReplace(),
    query: mockQuery()
  })
}))

jest.mock('../information', () => 'information')
jest.mock('../password', () => 'password')
jest.mock('../delete', () => 'delete')
jest.mock('../hpc', () => 'hpc')

let wrapper
describe('components/account', () => {
  beforeEach(() => {
    mockReplace.mockReset()
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({}))

    wrapper = shallow(<Account />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onChange', () => {
    wrapper.find('Tabs').props().onChange()
    expect(mockReplace).toHaveBeenCalledTimes(1)
  })
})
