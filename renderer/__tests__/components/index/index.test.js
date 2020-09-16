import Index from '../../../components/index'
import { shallow } from 'enzyme'

import '../../../../config/jest/matchMediaMock'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockRouter
  })
}))

jest.mock('../../../components/background', () => 'background')

let mockUser
jest.mock('../../../../src/api/user', () => ({
  useUser: () => [mockUser()]
}))

let wrapper
describe('renderer/components/index', () => {
  beforeEach(() => {
    mockUser = () => ({})
    wrapper = shallow(<Index />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onSelect', () => {
    wrapper.find('Menu').props().onSelect({ item: 'item', key: 'key' })
    expect(mockRouter).toHaveBeenCalledTimes(0)

    wrapper.find('Menu').props().onSelect({ item: 'item', key: 'dashboard' })
    expect(mockRouter).toHaveBeenCalledTimes(1)

    wrapper.find('Menu').props().onSelect({ item: 'item', key: 'login' })
    expect(mockRouter).toHaveBeenCalledTimes(2)
  })

  it('without user', () => {
    wrapper.unmount()
    mockUser = () => {}
    wrapper = shallow(<Index />)
    expect(wrapper.find('Menu').props().children.props.children).toBe('Login')
  })
})
