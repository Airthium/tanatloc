import Dashboard from '../../../components/dashboard'
import { shallow } from 'enzyme'

import '../../../../config/jest/matchMediaMock'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockRouter
  })
}))

jest.mock('../../../components/project/list', () => 'list')

jest.mock('../../../../src/auth/useUser', () => ({
  useUser: () => [{}, { mutate: jest.fn(), loading: true }]
}))

jest.mock('../../../../src/api/logout', () => async () => {})

let wrapper
describe('components/dashboard', () => {
  beforeEach(() => {
    wrapper = shallow(<Dashboard />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onSelect', () => {
    // Empty
    wrapper.find('Menu').props().onSelect({})

    // Workspaces
    wrapper.find('Menu').props().onSelect({ key: '1' })

    // Shared
    wrapper.find('Menu').props().onSelect({ key: '2' })

    // Account
    wrapper.find('Menu').props().onSelect({ key: '3' })

    // Help
    wrapper.find('Menu').props().onSelect({ key: '4' })

    // Logout
    wrapper.find('Menu').props().onSelect({ key: '5' })
  })
})
