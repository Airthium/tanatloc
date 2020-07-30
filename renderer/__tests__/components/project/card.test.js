import Card from '../../../components/project/card'
import { shallow } from 'enzyme'

let wrapper
describe('component/project/card', () => {
  beforeEach(() => {
    wrapper = shallow(<Card />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('handle buttons', () => {
    wrapper.find({ type: 'primary' }).forEach((button) => {
      button.simulate('click')
    })
  })
})
