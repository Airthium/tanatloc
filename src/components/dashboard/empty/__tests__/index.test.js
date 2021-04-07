import Empty from '..'
import { shallow } from 'enzyme'

describe('components/dashboard/empty', () => {
  it('render', () => {
    const wrapper = shallow(<Empty />)
    expect(wrapper).toBeDefined()
  })
})
