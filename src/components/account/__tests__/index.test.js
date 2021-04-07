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

jest.mock('../information', () => {
  const Information = () => <div />
  return Information
})

jest.mock('../password', () => {
  const Password = () => <div />
  return Password
})

jest.mock('../delete', () => {
  const Delete = () => <div />
  return Delete
})

jest.mock('../hpc', () => {
  const HPC = () => <div />
  return HPC
})

let wrapper
describe('components/account', () => {
  const user = { email: 'email' }
  const mutateUser = jest.fn()
  const swr = {
    mutateUser
  }

  beforeEach(() => {
    mockReplace.mockReset()
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({}))

    wrapper = shallow(<Account user={user} swr={swr} />)
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
