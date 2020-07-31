import Project from '../../../components/project'
import { shallow } from 'enzyme'

describe('components/project', () => {
  it('render', () => {
    const wrapper = shallow(<Project />)
    expect(wrapper).toBeDefined()
    wrapper.unmount()
  })
})
