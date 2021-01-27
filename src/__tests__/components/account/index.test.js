import Account from '@/components/account'
import { shallow } from 'enzyme'

const mockReplace = jest.fn()
const mockQuery = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    replace: () => mockReplace(),
    query: mockQuery()
  })
}))

jest.mock('@/components/account/information', () => 'information')
jest.mock('@/components/account/password', () => 'password')
jest.mock('@/components/account/delete', () => 'delete')
jest.mock('@/components/account/hpc', () => 'hpc')

let wrapper
describe('src/components/account', () => {
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
