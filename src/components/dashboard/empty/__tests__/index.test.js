import Empty from '..'
import { shallow } from 'enzyme'

describe('components/dashboard/empty', () => {
  test('render', () => {
    const wrapper = shallow(<Empty />)
    expect(wrapper).toBeDefined()
  })
})
