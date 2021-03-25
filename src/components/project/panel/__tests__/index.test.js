import Panel from '@/components/project/panel'
import { shallow } from 'enzyme'

let wrapper
describe('components/project/panel', () => {
  const onClose = jest.fn()

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    wrapper = shallow(<Panel visible={true} title="title" onClose={onClose} />)
    expect(wrapper).toBeDefined()
  })

  it('no visible', () => {
    wrapper = shallow(<Panel visible={false} title="title" onClose={onClose} />)
    expect(wrapper).toBeDefined()
  })
})
