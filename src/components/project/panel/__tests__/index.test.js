import Panel from '@/components/project/panel'
import { shallow } from 'enzyme'

let wrapper
describe('components/project/panel', () => {
  const onClose = jest.fn()

  afterEach(() => {
    wrapper.unmount()
  })

  test('render', () => {
    wrapper = shallow(<Panel visible={true} title="title" onClose={onClose} />)
    expect(wrapper).toBeDefined()
  })

  test('no visible', () => {
    wrapper = shallow(<Panel visible={false} title="title" onClose={onClose} />)
    expect(wrapper).toBeDefined()
  })
})
