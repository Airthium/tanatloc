import Index from '../../../components/index'
import { shallow } from 'enzyme'

import '../../../../config/jest/matchMediaMock'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockRouter
  })
}))

describe('components/index', () => {
  it('render', () => {
    const wrapper = shallow(<Index />)
    expect(wrapper).toBeDefined()
    wrapper.unmount()
  })

  it('handleClick', () => {
    const wrapper = shallow(<Index />)
    wrapper.find('Button').props().onClick()
    expect(mockRouter).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })
})
