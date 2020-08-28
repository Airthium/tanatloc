import Index from '../../../components/index'
import { shallow } from 'enzyme'

import '../../../../config/jest/matchMediaMock'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockRouter
  })
}))

let wrapper
describe('renderer/components/index', () => {
  beforeEach(() => {
    wrapper = shallow(<Index />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('handleClick', () => {
    wrapper.find('Button').props().onClick()
    expect(mockRouter).toHaveBeenCalledTimes(1)
  })
})
